const PANELS = [
  {
    icon: 'icons/recipe.svg',
    color: '#005eb8',
    title: 'Active Recipe',
    value: '14gky*',
    data: [
      { name: 'Retention Time 01', target: '-', actual: '28 min' },
    ],
  },
  {
    icon: 'icons/snowflake.svg',
    color: '#00a99d',
    title: 'Machine Subsystems Information',
    value: '-20.1 °C',
    data: [
      { name: 'Belt Speed', target: '-', actual: '13.5 m/min' },
      { name: 'Evaporator 1 Temperature', target: '-', actual: '-30.2 °C' },
      { name: 'Air Temperature PV', target: '-', actual: '-26.9 °C' },
      { name: 'Rail Temperature', target: '-', actual: '-20.1 °C' },
    ],
  },
];

document.querySelectorAll('machine-overview-grid').forEach((panel, index) => {
  Object.assign(panel, PANELS[index]);
});
