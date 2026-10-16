/* Narrow VChart configuration checks; rendering and visual acceptance are separate. */
(function (root) {
  function validateSpec(spec) {
    const errors = [];
    if (!spec || typeof spec !== 'object' || Array.isArray(spec)) {
      return {ok: false, errors: [{code: 'SPEC_OBJECT_REQUIRED', path: 'spec', message: 'Define a spec object.'}]};
    }
    // Graphic coordinates are not CSS lengths. Do not evaluate callbacks here:
    // their pixel values depend on the actual browser layout.
    function checkCustomMarks(marks, path) {
      if (!Array.isArray(marks)) return;
      marks.forEach((mark, index) => {
        if (!mark || typeof mark !== 'object') return;
        for (const axis of ['x', 'y']) {
          if (typeof mark.style?.[axis] === 'string' && mark.style[axis].trim().endsWith('%')) {
            errors.push({code: 'CUSTOM_MARK_PIXEL_COORDINATE', path: `${path}[${index}].style.${axis}`, message: 'customMark x/y are graphic coordinates, not CSS percentages. Use pixel numbers or layout callbacks returning pixels; see references/sops/empty-state.md.'});
          }
        }
        checkCustomMarks(mark.children, `${path}[${index}].children`);
      });
    }
    checkCustomMarks(spec.customMark, 'spec.customMark');
    const charts = [{config: spec, path: 'spec'}, ...(spec.series || []).map((config, index) => ({config, path: `spec.series[${index}]`}))];
    for (const {config, path} of charts) {
      for (const key of ['label', 'nonLeafLabel']) {
        if (typeof config[key]?.formatter === 'function') {
          errors.push({code: 'FUNCTION_FORMATTER', path: `${path}.${key}.formatter`, message: 'formatter is a template string; use formatMethod for a function.'});
        }
      }
      const data = Array.isArray(config.data) ? config.data : config.data ? [config.data] : [];
      for (const [index, entry] of data.entries()) {
        if (!entry || typeof entry !== 'object') continue;
        if ('value' in entry && !('values' in entry)) {
          errors.push({code: 'DATA_VALUES_REQUIRED', path: `${path}.data[${index}]`, message: 'Use data.values for inline data; a hierarchy root belongs inside the values array.'});
        }
        const hierarchyNode = ['treemap', 'sunburst'].includes(config.type) &&
          ('children' in entry || (typeof config.categoryField === 'string' && config.categoryField in entry));
        const dataReference = typeof entry.fromDataId === 'string' || typeof entry.fromDataIndex === 'number';
        if (hierarchyNode && !('values' in entry) && !('value' in entry) && !dataReference) {
          errors.push({code: 'DATA_VALUES_REQUIRED', path: `${path}.data[${index}]`, message: 'data contains data-source descriptors, not hierarchy nodes. Put root nodes inside data.values.'});
        }
        const parsedText = typeof entry.values === 'string' && ['csv', 'dsv', 'tsv'].includes(entry.parser?.type);
        if (['treemap', 'sunburst'].includes(config.type) && 'values' in entry && !Array.isArray(entry.values) && !parsedText) {
          errors.push({code: 'HIERARCHY_ROOT_ARRAY', path: `${path}.data[${index}].values`, message: 'Hierarchy values must be an array of root nodes, or text with a csv/dsv/tsv parser; children stay on each node.'});
        }
      }
    }
    // Resolve each series' actual data rather than treating every root dataset
    // as graph data. Combined charts may keep unrelated datasets at the root.
    const sources = data => Array.isArray(data) ? data : data ? [data] : [];
    const series = spec.series?.length ? spec.series : [spec];
    for (const [index, config] of series.entries()) {
      if ((config.type || spec.type) !== 'sankey') continue;
      const path = spec.series?.length ? `spec.series[${index}].data` : 'spec.data';
      let data = config.data;
      if (data == null && config !== spec) {
        const rootData = sources(spec.data);
        // A series without inline data uses one root dataset, first by default.
        // Unresolved explicit references are left to runtime validation.
        if (config.dataId != null) data = rootData.find(d => d?.id === config.dataId);
        else data = rootData[config.dataIndex ?? 0];
      }
      const entries = sources(data);
      // The runtime also accepts separate datasets named nodes and links.
      if (entries.length === 2 && entries.some(d => d.id === 'nodes') && entries.some(d => d.id === 'links')) continue;
      for (const [i, entry] of entries.entries()) {
        if (!entry || !Array.isArray(entry.values) || entry.values.length === 0 || entry.transforms?.length) continue;
        const graph = entry.values[0];
        // A nodes-only hierarchy is also valid. Endpoint mapping is controlled
        // by nodeKey/sourceField/targetField, not by a fixed business schema.
        if (entry.values.length !== 1 || !graph || (!Array.isArray(graph.nodes) && !Array.isArray(graph.links))) {
          errors.push({code: 'SANKEY_GRAPH_REQUIRED', path: `${path}[${i}].values`, message: 'Sankey values must contain one graph object: [{nodes, links}], not flat edge rows. Put the requested edge data in links; derive unique nodes and set nodeKey when endpoints use names. A nodes-only hierarchy or separate nodes/links datasets is also supported.'});
        }
      }
    }
    return {ok: errors.length === 0, errors};
  }
  if (typeof module === 'object' && module.exports) module.exports = {validateSpec};
  else root.VChartSpecContract = {validateSpec};
})(typeof globalThis === 'object' ? globalThis : this);
