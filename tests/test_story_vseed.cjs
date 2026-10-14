// Run against the same UMD version pinned by the story templates.
// npm ci --prefix evals && node --test tests/test_story_vseed.cjs
const assert = require('node:assert/strict');
const { test } = require('node:test');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const vm = require('node:vm');
// Load the browser UMD contract independent of the npm package's ESM metadata.
const bundle = {exports: {}};
const filename = path.resolve(__dirname, '../evals/node_modules/@visactor/vseed/dist/umd/index.js');
vm.runInThisContext('(function(module,exports){' + fs.readFileSync(filename, 'utf8') + '\n})', {filename})(bundle, bundle.exports);
const runtime = bundle.exports;
runtime.registerAll();

// Exercise the private merge helper in a fresh realm for each test so a
// regression cannot pollute this test runner or another test's prototypes.
const storySource = fs.readFileSync(path.resolve(__dirname, '../skills/data-storytelling/scripts/vseed-render.js'), 'utf8');
const helpersStart = storySource.indexOf('  function isPlainObject(value)');
const helpersEnd = storySource.indexOf('  function getThemeChartConfig(', helpersStart);
assert.ok(helpersStart >= 0 && helpersEnd > helpersStart, 'Story theme helpers must be available');
const themeHelpers = storySource.slice(helpersStart, helpersEnd);
function mergeResult(code) {
  return JSON.parse(vm.runInNewContext(themeHelpers + '\nJSON.stringify((() => {\n' + code + '\n})())'));
}

for (const key of ['__proto__', 'constructor', 'prototype']) {
  for (const nested of [false, true]) {
    test(`theme merging rejects ${key} ${nested ? 'inside nested defaults' : 'at the root'}`, () => {
      const value = key === 'constructor' ? {prototype: {polluted: true}} : {polluted: true};
      const defaults = nested ? {style: {[key]: value, radius: 4}} : {[key]: value, radius: 4};
      const result = mergeResult(`
        const target = {};
        mergeThemeDefaults(target, JSON.parse(${JSON.stringify(JSON.stringify(defaults))}));
        return {
          output: target,
          prototypeClean: !Object.prototype.hasOwnProperty.call(Object.prototype, 'polluted'),
          originalPrototype: Object.getPrototypeOf(target) === Object.prototype
        };
      `);
      assert.deepEqual(result, {
        output: nested ? {style: {radius: 4}} : {radius: 4},
        prototypeClean: true,
        originalPrototype: true,
      });
    });
  }
}

test('theme defaults preserve unrelated settings and override supported nested values', () => {
  assert.deepEqual(mergeResult(`
    const target = {barMaxWidth: 30, style: {color: 'blue', radius: 1}, palette: ['old']};
    const merged = mergeThemeDefaults(target, {barMaxWidth: 72, style: {radius: 4}, palette: ['new']});
    return {sameTarget: merged === target, output: merged};
  `), {
    sameTarget: true,
    output: {barMaxWidth: 72, style: {color: 'blue', radius: 4}, palette: ['new']},
  });
});

test('theme merging creates own nested settings instead of mutating inherited objects', () => {
  assert.deepEqual(mergeResult(`
    const inherited = {style: {radius: 1}};
    const target = Object.create(inherited);
    mergeThemeDefaults(target, {style: {radius: 4}});
    return {output: target, inherited, ownStyle: Object.prototype.hasOwnProperty.call(target, 'style')};
  `), {
    output: {style: {radius: 4}},
    inherited: {style: {radius: 1}},
    ownStyle: true,
  });
});

const dataset = [{ category: 'A', group: 'East', value: 10, other: 20 }, { category: 'B', group: 'West', value: 20, other: 30 }];
const field = (id, encoding) => ({ id, encoding });
const bindings = {
  line: [[field('category', 'xAxis')], [field('value', 'yAxis')]],
  area: [[field('category', 'xAxis')], [field('value', 'yAxis')]],
  column: [[field('category', 'xAxis')], [field('value', 'yAxis')]],
  columnParallel: [[field('category', 'xAxis'), field('group', 'color')], [field('value', 'yAxis')]],
  columnPercent: [[field('category', 'xAxis'), field('group', 'color')], [field('value', 'yAxis')]],
  bar: [[field('category', 'yAxis')], [field('value', 'xAxis')]],
  barParallel: [[field('category', 'yAxis'), field('group', 'color')], [field('value', 'xAxis')]],
  barPercent: [[field('category', 'yAxis'), field('group', 'color')], [field('value', 'xAxis')]],
  pie: [[field('category', 'color')], [field('value', 'angle')]],
  donut: [[field('category', 'color')], [field('value', 'angle')]],
  scatter: [[field('category', 'color')], [field('value', 'xAxis'), field('other', 'yAxis')]],
  radar: [[field('category', 'angle')], [field('value', 'radius')]],
  heatmap: [[field('category', 'xAxis'), field('group', 'yAxis')], [field('value', 'color')]],
  funnel: [[field('category', 'color')], [field('value', 'size')]],
  dualAxis: [[field('category', 'xAxis')], [{ ...field('value', 'primaryYAxis'), chartType: 'column' }, { ...field('other', 'secondaryYAxis'), chartType: 'line' }]],
};
function input(chartType, extra = {}) {
  const [dimensions, measures] = bindings[chartType];
  return { chartType, dataset, dimensions, measures, ...extra };
}
async function build(spec) {
  const parsed = runtime.zVSeed.safeParse(spec);
  assert.equal(parsed.success, true, parsed.error?.message);
  const builder = runtime.Builder.from(spec);
  await builder.prepare();
  return builder.build();
}
for (const chartType of Object.keys(bindings)) {
  test(`${chartType} supports the documented minimal encodings`, async () => {
    assert.ok((await build(input(chartType))).type);
  });
}
test('all four annotation families survive VSeed compilation', async () => {
  const output = await build(input('line', {
    annotationPoint: [{ selector: { category: 'B' }, measureId: 'value', text: 'Peak' }],
    annotationHorizontalLine: [{ yValue: 15, text: 'Threshold' }],
    annotationArea: [{ selector: { field: 'category', operator: 'in', value: ['A', 'B'] }, text: 'Window' }],
    annotationDifferenceLine: [{ start: { selector: { category: 'A' } }, end: { selector: { category: 'B' } }, differenceType: 'absolute' }],
  }));
  assert.deepEqual([output.markPoint.length, output.markLine.length, output.markArea.length], [1, 2, 1]);
});
test('wide-table measure selector weakens only its own line series', async () => {
  const output = await build(input('line', {
    measures: [field('value', 'yAxis'), field('other', 'yAxis')],
    lineStyle: [{ selector: 'other', lineColorOpacity: 0.2 }],
  }));
  const state = Object.values(output.line.state)[0];
  const selected = output.data.values.filter(row => state.filter(row, { renderNode: { context: { data: [row] } } }));
  assert.deepEqual([...new Set(selected.map(row => row.__MeaId__))], ['other']);
});
test('categorical series selector preserves the focused line', async () => {
  const output = await build(input('line', {
    dimensions: [field('category', 'xAxis'), field('group', 'color')],
    lineStyle: [{ selector: { field: 'group', operator: 'not in', value: ['East'] }, lineColorOpacity: 0.2 }],
  }));
  const state = Object.values(output.line.state)[0];
  const selected = output.data.values.filter(row => state.filter(row, { renderNode: { context: { data: [row] } } }));
  assert.deepEqual(selected.map(row => row.group), ['West']);
});
for (const chartType of ['pie', 'donut', 'radar']) {
  test(`${chartType} uses explicit color mappings for emphasis`, async () => {
    const key = chartType === 'radar' ? 'value' : 'A';
    const colorMapping = { [key]: 'rgba(10,80,200,0.2)' };
    assert.deepEqual((await build(input(chartType, { color: { colorMapping } }))).color.specified, colorMapping);
  });
}

test('a point with color and multiple measures resolves exactly the requested measure', async () => {
  const output = await build(input('line', {
    dimensions: [field('category', 'xAxis'), field('group', 'color')],
    measures: [field('value', 'yAxis'), field('other', 'yAxis')],
    annotationPoint: [{ selector: { category: 'B', group: 'West' }, measureId: 'other', text: 'Peak' }],
  }));
  assert.equal(output.markPoint.length, 1);
});

test('selector arrays intersect category and measure conditions for emphasis', async () => {
  const output = await build(input('line', {
    dimensions: [field('category', 'xAxis'), field('group', 'color')],
    measures: [field('value', 'yAxis'), field('other', 'yAxis')],
    lineStyle: [{ selector: [{ group: 'West' }, 'other'], lineColorOpacity: 0.2 }],
  }));
  const state = Object.values(output.line.state)[0];
  const selected = output.data.values.filter(row => state.filter(row, { renderNode: { context: { data: [row] } } }));
  assert.deepEqual(selected.map(row => [row.group, row.__MeaId__]), [['West', 'other']]);
});

test('dual-axis point binds to the secondary measure series', async () => {
  const output = await build(input('dualAxis', {
    annotationPoint: [{ selector: { category: 'B' }, measureId: 'other', text: 'Peak' }],
  }));
  assert.deepEqual(output.markPoint.map(point => point.relativeSeriesIndex), [1]);
});

test('a category area spans the full value-axis region, not a numeric rectangle', async () => {
  const output = await build(input('line', {
    annotationArea: [{ selector: { field: 'category', operator: 'in', value: ['A', 'B'] }, text: 'Window' }],
  }));
  const positions = output.markArea[0].positions(output.data.values, {
    dataToPosition: row => ({ x: row.category === 'A' ? 10 : 30, y: row.value }),
    getXAxisHelper: () => ({ getBandwidth: () => 10 }),
    getYAxisHelper: () => ({}),
    getRegion: () => ({ getLayoutRect: () => ({ width: 100, height: 200 }) }),
  });
  assert.deepEqual(positions, [{ x: 6, y: 0 }, { x: 34, y: 0 }, { x: 34, y: 200 }, { x: 6, y: 200 }]);
});

test('a scatter selector alone does not define a continuous coordinate rectangle', async () => {
  const output = await build(input('scatter', {
    annotationArea: [{ selector: { field: 'value', operator: '>=', value: 10 }, text: 'Window' }],
  }));
  const positions = output.markArea[0].positions(output.data.values, {
    dataToPosition: () => ({ x: 10, y: 20 }),
    getXAxisHelper: () => ({}),
    getYAxisHelper: () => ({}),
  });
  assert.deepEqual(positions, []);
});

function linearSeries({ inverse = false, yMax = 1 } = {}) {
  return {
    getXAxisHelper: () => ({ getScale: () => ({ domain: () => [0, 100] }), dataToPosition: ([value]) => value }),
    getYAxisHelper: () => ({ getScale: () => ({ domain: () => [0, yMax] }), dataToPosition: ([value]) => 200 * (inverse ? value / yMax : 1 - value / yMax) }),
    getRegion: () => ({ getLayoutRect: () => ({ width: 100, height: 200 }) }),
  };
}

for (const chartType of ['line', 'area', 'column', 'columnParallel', 'columnPercent', 'bar', 'barParallel', 'barPercent', 'scatter']) {
  test(`${chartType} compiles ranges on its numeric axis`, async () => {
    const axis = chartType.startsWith('bar') ? 'x' : 'y';
    const output = await build(input(chartType, {
      annotationArea: [{ range: { [axis]: { min: 0.2, max: 0.4 } }, text: 'Target' }],
    }));
    assert.equal(output.markArea.length, 1);
  });
}

test('a percentage range spans the plot even with no points inside it', async () => {
  const output = await build(input('line', {
    annotationArea: [{ range: { y: { min: 0.2, max: 0.4 } }, text: '20%–40%' }],
  }));
  assert.deepEqual(output.markArea[0].positions([], linearSeries()), [
    { x: 0, y: 120 }, { x: 100, y: 120 }, { x: 100, y: 160 }, { x: 0, y: 160 },
  ]);
});

test('a scatter rectangle uses both axes and keeps its middle label', async () => {
  const output = await build(input('scatter', {
    annotationArea: [{ range: { x: { min: 0, max: 50 }, y: { min: 0.2, max: 0.4 } }, text: 'Target', textPosition: 'middle' }],
  }));
  assert.deepEqual({ positions: output.markArea[0].positions([], linearSeries()), label: output.markArea[0].label.position }, {
    positions: [{ x: 0, y: 120 }, { x: 50, y: 120 }, { x: 50, y: 160 }, { x: 0, y: 160 }],
    label: 'middle',
  });
});

test('visible axis sentinels and clipping use current bounds, not dataset extrema', async () => {
  const output = await build(input('scatter', {
    annotationArea: [
      { range: { x: { min: 'axisMin', max: 'axisMax' }, y: { min: 0.2, max: 2 } } },
      { range: { y: { min: 2, max: 3 } } },
    ],
  }));
  assert.deepEqual(output.markArea.map(area => area.positions([], linearSeries())), [
    [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 100, y: 160 }, { x: 0, y: 160 }], [],
  ]);
});

test('range min/max keep their numeric meaning on an inverse axis', async () => {
  const output = await build(input('scatter', { annotationArea: [{ range: { y: { min: 0.2, max: 0.4 } } }] }));
  assert.deepEqual(output.markArea[0].positions([], linearSeries({ inverse: true })), [
    { x: 0, y: 40 }, { x: 100, y: 40 }, { x: 100, y: 80 }, { x: 0, y: 80 },
  ]);
});

test('independent category and numeric bands can coexist', async () => {
  const output = await build(input('line', {
    annotationArea: [{ selector: { field: 'category', operator: 'in', value: ['A'] } }, { range: { y: { min: 0.2, max: 0.4 } } }],
  }));
  assert.equal(output.markArea.length, 2);
});

test('range schema rejects mixed modes, incomplete bounds and non-increasing intervals', () => {
  const invalid = [
    { selector: { category: 'A' }, range: { y: { min: 0.2, max: 0.4 } } },
    { range: {} }, { range: { y: { min: 0.2 } } },
    { range: { y: { min: 0.4, max: 0.2 } } }, { range: { y: { min: 0.2, max: 0.2 } } },
    { range: { y: { min: 0.2, max: Infinity } } },
    { range: { x: { min: '2026-02', max: '2026-03' } } },
  ];
  assert.deepEqual(invalid.map(area => runtime.zVSeed.safeParse(input('line', { annotationArea: [area] })).success), invalid.map(() => false));
});

test('category axes cannot be disguised as numeric range coordinates', async () => {
  await assert.rejects(build(input('line', { annotationArea: [{ range: { x: { min: 1, max: 2 } } }] })), /requires a linear numeric axis/);
});

test('dual-axis charts reject numeric area ranges', async () => {
  await assert.rejects(build(input('dualAxis', { annotationArea: [{ range: { y: { min: 0.2, max: 0.4 } } }] })), /does not support/);
});

test('four scatter quadrant ranges tile the visible axes and retain empty regions', async () => {
  const annotationArea = [[false, true], [true, true], [false, false], [true, false]].map(([highX, highY]) => ({
    range: {
      x: { min: highX ? 50 : 'axisMin', max: highX ? 'axisMax' : 50 },
      y: { min: highY ? 0.4 : 'axisMin', max: highY ? 'axisMax' : 0.4 },
    },
    textPosition: 'middle',
    text: `${highX ? 'High' : 'Low'} X / ${highY ? 'High' : 'Low'} Y`,
  }));
  const output = await build(input('scatter', { annotationArea }));
  const bounds = output.markArea.map(area => {
    const points = area.positions([], linearSeries());
    return [points[0].x, points[1].x, points[0].y, points[2].y, area.label.position];
  });
  assert.deepEqual(bounds, [
    [0, 50, 0, 120, 'middle'], [50, 100, 0, 120, 'middle'],
    [0, 50, 120, 200, 'middle'], [50, 100, 120, 200, 'middle'],
  ]);
});

// Keep normalized axes independent of raw quantity formatting through assembly and VSeed.
const root = path.resolve(__dirname, '..');
for (const [chartType, valueAxis, categoryAxis, orient] of [
  ['columnPercent', 'yAxis', 'xAxis', 'left'],
  ['barPercent', 'xAxis', 'yAxis', 'bottom'],
]) {
  test(`${chartType} retains percent ticks after assembling raw quantity formats`, async () => {
    const spec = {
      chartType,
      dimensions: [{ id: 'period', encoding: categoryAxis }, { id: 'group', encoding: 'color' }],
      measures: [{ id: 'amount', encoding: valueAxis, numFormat: { type: 'number', suffix: ' units' } }],
    };
    const dataset = [{ period: 'A', group: 'one', amount: 25 }, { period: 'A', group: 'two', amount: 75 }];
    const assembled = JSON.parse(execFileSync('uv', ['run', '--locked', 'python', '-c', `
import json,sys
sys.path.insert(0, sys.argv[1])
from local_chart_specs import assemble_local_specs
s,d=json.load(sys.stdin)
request={"chartId":"chart","datasetRef":"data","annotations":[],"contract":{"chart_type":s["chartType"],"dimensions":s["dimensions"],"measures":s["measures"]}}
print(json.dumps(assemble_local_specs([request],{"data":d},{"chart":s})["chart"]["spec"]))
`, path.join(root, 'skills/data-storytelling/scripts')], { cwd: root, input: JSON.stringify([spec, dataset]), encoding: 'utf8' }));
    const builder = runtime.Builder.from(assembled);
    await builder.prepare();
    const chart = builder.build();
    const axis = chart.axes.find(a => a.orient === orient && a.type === 'linear');
    assert.deepEqual([0, 0.5, 1].map(value => axis.label.formatMethod(value)), ['0.00%', '50.00%', '100.00%']);
    assert.deepEqual(assembled.dataset, dataset);
    assert.equal(assembled.measures[0].numFormat.suffix, ' units');
  });
}
