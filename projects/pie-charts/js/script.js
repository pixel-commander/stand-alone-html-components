const COMPONENT = document.querySelector('pie-charts');

COMPONENT.data = [
  { group: 'Running', value: 62, color: '#4caf50' },
  { group: 'Idle', value: 24, color: '#ffb300' },
  { group: 'Fault', value: 14, color: '#e53935' },
];

COMPONENT.unit = '%';

COMPONENT.handleClick = (item) => console.log(item.group, item.value);
