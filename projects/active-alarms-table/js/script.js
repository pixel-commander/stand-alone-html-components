const ALARMS = document.querySelector('active-alarms-table');

ALARMS.data = [
  { date: '06/18/2026 - 12:58:00 PM', id: 'ID 260', description: '20018: Door 02 opened' },
  { date: '06/18/2026 - 12:58:00 PM', id: 'ID 258', description: '20017: Door 01 opened' },
  { date: '06/25/2026 - 4:03:00 AM', id: 'ID 66701', description: 'Test Alert Name' },
  { date: '05/27/2026 - 3:41:00 AM', id: 'ID 66701', description: 'Test Alert Name' },
  { date: '04/27/2026 - 4:07:00 AM', id: 'ID 66701', description: 'Test Alert Name' },
  { date: '04/02/2026 - 1:38:00 AM', id: 'ID 66701', description: 'Test Alert Name' },
  { date: '04/01/2026 - 2:52:00 AM', id: 'ID 66701', description: 'Test Alert Name' },
];

ALARMS.handleClick = (row) => {
  console.log(row.id, row.description);
};
