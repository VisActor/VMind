import { generateChart } from '../../src';
import { MAP_DATA } from '../common';

describe('generate map chart', () => {
  it('generate map chart', () => {
    const { spec } = generateChart('map', {
      dataTable: MAP_DATA,
      cell: {
        color: 'name',
        size: 'value'
      },
      spec: {}
    });

    expect(spec).toEqual({
      type: 'map',
      region: [
        {
          roam: true,
          coordinate: 'geo'
        }
      ],
      map: 'map',
      color: {
        type: 'linear',
        range: ['#1DD0F3', '#2693FF', '#3259F4', '#1B0CA1', '#CB2BC6', '#FF581D', '#FBBB16', '#F6FB17', '#73EC55']
      },
      data: [
        {
          id: 'data',
          values: MAP_DATA
        }
      ],
      nameField: 'name',
      valueField: 'value',
      nameProperty: 'name',
      legends: [
        {
          visible: true,
          type: 'color',
          field: 'value',
          orient: 'bottom',
          position: 'start'
        }
      ],
      area: {
        style: {
          fill: {
            field: 'value',
            scale: 'color',
            changeDomain: 'replace'
          }
        }
      }
    });
  });
});
