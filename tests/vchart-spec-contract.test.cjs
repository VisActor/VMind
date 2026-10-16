const test = require('node:test');
const assert = require('node:assert/strict');
const {validateSpec} = require('../skills/vchart-skill/scripts/spec-contract.cjs');
const {validateSource} = require('../skills/vchart-skill/scripts/validate_spec.cjs');
const edges = [{source:'Channel',target:'Product',value:37}, {source:'Product',target:'Order',value:12}];
const graph = {nodes:[{name:'Channel'},{name:'Product'},{name:'Order'}],links:edges};
const codes = spec => validateSpec(spec).errors.map(e => e.code);
for (const [name, spec] of [
  ['root array', {type:'sankey',data:[{values:edges}]}],
  ['series', {type:'sankey',series:[{type:'sankey',data:{values:edges}}]}],
  ['root object', {type:'sankey',data:{values:edges}}],
  ['dataset reference', {type:'common',data:[{id:'flow',values:edges}],series:[{type:'sankey',dataId:'flow'}]}]
]) test(`rejects flat edges: ${name}`,()=>assert.deepEqual(codes(spec),['SANKEY_GRAPH_REQUIRED']));
for (const [name,data] of [
  ['graph',{values:[graph]}], ['empty',{values:[]}],['empty graph',{values:[{nodes:[],links:[]}]}],
  ['hierarchy',{values:[{nodes:[{name:'Root',children:[{name:'Leaf',value:9}]}]}]}],
  ['separate',[{id:'nodes',values:graph.nodes},{id:'links',values:edges}]],
  ['deferred reference',{fromDataId:'upstream'}]
]) test(`accepts supported sankey input: ${name}`,()=>assert.equal(validateSpec({type:'sankey',data}).ok,true));
test('does not validate an unrelated combined-chart dataset as sankey',()=>{
  assert.equal(validateSpec({type:'common',data:[{id:'bars',values:[{x:'a',y:3}]},{id:'flow',values:[graph]}],series:[{type:'bar',dataId:'bars'},{type:'sankey',dataId:'flow'}]}).ok,true);
});
for (const [name, config] of [
  ['default first dataset', {}],
  ['explicit index zero', {dataIndex:0}],
  ['id takes precedence over index', {dataId:'flow',dataIndex:1}],
  ['inline data takes precedence', {data:{values:[graph]},dataId:'extra'}],
  ['unresolved id', {dataId:'missing'}],
  ['unresolved index', {dataIndex:9}],
]) test(`only checks selected sankey data: ${name}`,()=>{
  assert.equal(validateSpec({type:'common',data:[{id:'flow',values:[graph]},{id:'extra',values:[{x:'a',y:3}]}],series:[{type:'sankey',...config}]}).ok,true);
});
test('checks explicit nonzero dataset index',()=>assert.equal(validateSpec({type:'common',data:[{values:edges},{values:[graph]}],series:[{type:'sankey',dataIndex:1}]}).ok,true));
test('still rejects malformed default first dataset',()=>assert.deepEqual(codes({type:'common',data:[{values:edges},{values:[graph]}],series:[{type:'sankey'}]}),['SANKEY_GRAPH_REQUIRED']));
test('rejects singular data.value',()=>assert.deepEqual(codes({type:'treemap',data:{value:{children:[]}}}),['DATA_VALUES_REQUIRED']));
test('rejects object instead of tree roots array',()=>assert.deepEqual(codes({type:'treemap',data:{values:{children:[]}}}),['HIERARCHY_ROOT_ARRAY']));
test('permits arbitrary hierarchy field names and non-100 totals',()=>assert.equal(validateSpec({type:'treemap',categoryField:'item',valueField:'revenue',data:{values:[{item:'Group',children:[{item:'A',revenue:7},{item:'B',revenue:16}]}]}}).ok,true));
test('rejects function label formatter but retains tooltip callbacks',()=>{
  assert.deepEqual(codes({type:'treemap',data:{values:[]},label:{formatter:()=>''},nonLeafLabel:{formatMethod:()=>''},tooltip:{mark:{title:{value:()=>''}}}}),['FUNCTION_FORMATTER']);
});
test('evaluates complete source and helper closures',()=>assert.equal(validateSource('const rows = [{x:"P",y:31}]; function make() { return {type:"bar",data:{values:rows}}; } const spec = make();').ok,true));
test('rejects syntax errors',()=>assert.equal(validateSource('const spec = {').errors[0].code,'SOURCE_SYNTAX'));
test('reports deferred runtime globals without claiming spec was checked',()=>{
  const r=validateSource('const spec = window.buildChart();');assert.equal(r.specChecked,false);assert.equal(r.warnings[0].code,'RUNTIME_VALIDATION_DEFERRED');
});
test('limits source evaluation',()=>assert.equal(validateSource('while(true) {}').ok,false));

test('treemap example computes shares from changed data and preserves original records',()=>{
  const fs=require('node:fs'),vm=require('node:vm');
  const source=fs.readFileSync(require.resolve('../skills/vchart-skill/references/examples/treemap/hierarchy-treemap.js'),'utf8');
  const ctx={document:{createElement:()=>({getContext:()=>({measureText:text=>({width:text.length*7})})})}};
  vm.runInNewContext(source,ctx);
  const rows=[{region:'East',sku:'Blueberry',units:11},{region:'East',sku:'Cherry',units:32},{region:'West',sku:'Apple',units:7}];
  const spec=ctx.createTreemapSpec(rows,{hierarchyFields:['region','sku'],valueField:'units',groupField:'region',palette:{East:'#123456',West:'#654321'}});
  const raw=spec.data.values[0].children[0].children[0];
  const node={datum:[{sku:'Total'},{sku:'East'},raw],x0:0,x1:220,y0:0,y1:100};
  assert.equal(spec.label.formatMethod('',node),'Blueberry 22%');
  assert.equal(spec.leaf.style.fill(node),'#123456');
  assert.equal(spec.tooltip.mark.content[1].value(node),'11');
  assert.equal(spec.label.formatMethod('',{...node,x1:20}), '');
  assert.deepEqual(JSON.parse(JSON.stringify(spec.data.values[0].children.flatMap(p=>p.children))),rows);
});

test('treemap example preserves empty input without synthetic leaves',()=>{
  const fs=require('node:fs'),vm=require('node:vm'),ctx={};
  vm.runInNewContext(fs.readFileSync(require.resolve('../skills/vchart-skill/references/examples/treemap/hierarchy-treemap.js'),'utf8'),ctx);
  const spec=ctx.createTreemapSpec([],{hierarchyFields:['category','item'],valueField:'quantity',groupField:'category',palette:{}});
  assert.equal(spec.data.values.length,0);
});

for (const axis of ['x','y']) test(`rejects CSS percentage custom-mark ${axis} regardless of chart and text`,()=>{
  const result=validateSpec({type:'line',data:{values:[]},customMark:[{type:'text',style:{[axis]:' 50% ',text:'No matching measurements'}}]});
  assert.deepEqual(result.errors.map(({code,path})=>({code,path})),[{code:'CUSTOM_MARK_PIXEL_COORDINATE',path:`spec.customMark[0].style.${axis}`}]);
});
test('validates graphic coordinates nested inside custom groups',()=>assert.deepEqual(codes({type:'bar',customMark:[{type:'group',children:[{type:'text',style:{x:'25%'}}]}]}),['CUSTOM_MARK_PIXEL_COORDINATE']));
test('accepts numeric coordinates and layout callbacks without executing them',()=>{
  const callback=()=>{throw Error('needs browser layout')};
  assert.equal(validateSpec({type:'treemap',customMark:[{type:'text',style:{x:callback,y:0,text:'Empty'}},{type:'text',style:{x:12,y:callback}}]}).ok,true);
});
test('leaves percentage layout properties and percentage text untouched',()=>assert.equal(validateSpec({type:'bar',padding:'5%',customMark:[{type:'text',style:{x:20,y:30,text:'50%'}}]}).ok,true));
test('accepts no custom marks after restoring data',()=>assert.equal(validateSpec({type:'bar',data:{values:[{category:'A',count:0}]},customMark:[]}).ok,true));
