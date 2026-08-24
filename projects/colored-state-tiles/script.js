const DATA = [
  { title: 'Running', value: 4, label: 'Climate System State', color: '#1a8a3f' },
  { title: 'Running', value: 4, label: 'Main Fan State', color: '#1a8a3f' },
  { title: 'Waiting to be selected', value: 1, label: 'ADF State', color: '#1565c0' },
];

ReactDOM.createRoot(document.getElementById('root')).render(<ColoredStateTiles data={DATA} />);
