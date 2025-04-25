const spec = {
  type: 'radar',
  data: [
    {
      id: 'radarData',
      values: [
        {
          key: 'Strength',
          value: 5
        },
        {
          key: 'Speed',
          value: 5
        },
        {
          key: 'Shooting',
          value: 3
        },
        {
          key: 'Endurance',
          value: 5
        },
        {
          key: 'Precision',
          value: 5
        },
        {
          key: 'Growth',
          value: 5
        }
      ]
    }
  ],
  categoryField: 'key',
  valueField: 'value',
  point: {
    visible: false // disable point
  },
  area: {
    visible: true, // display area
    state: {
      // The style in the hover state of the area
      hover: {
        fillOpacity: 0.5
      }
    }
  },
  line: {
    style: {
      lineWidth: 4
    }
  },
  axes: [
    {
      orient: 'radius', // radius axis
      zIndex: 100,
      min: 0,
      max: 8,
      domainLine: {
        visible: false
      },
      label: {
        visible: true,
        space: 0,
        style: {
          textAlign: 'center',
          stroke: '#fff',
          lineWidth: 4
        }
      },
      grid: {
        smooth: false,
        style: {
          lineDash: [0]
        }
      }
    },
    {
      orient: 'angle', // angle axis
      zIndex: 50,
      tick: {
        visible: false
      },
      domainLine: {
        visible: false
      },
      label: {
        space: 20
      },
      grid: {
        style: {
          lineDash: [0]
        }
      }
    }
  ]
};

export { spec };
