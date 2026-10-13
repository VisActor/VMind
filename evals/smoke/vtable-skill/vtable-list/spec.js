const tableInstance = new VTable.ListTable({
  container: document.getElementById('container'),
  records: {{RECORDS}},
  columns: [
    { field: 'region', title: 'Region', width: 180 },
    { field: 'quarter', title: 'Quarter', width: 180 },
    { field: 'sales', title: 'Sales', width: 180, sort: true }
  ]
});
