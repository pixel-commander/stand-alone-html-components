const DETAILS = [
  { label: 'Machine', value: 'Filler 04' },
  { label: 'State', value: 'Running' },
  { label: 'Recipe', value: 'Lager 500ml' },
  { label: 'Throughput', value: '482 bph' },
  { label: 'Temperature', value: '4.2 C' },
  { label: 'Last fault', value: '06:41 door open' },
];

ReactDOM.createRoot(document.getElementById('root')).render(<StyledDl data={DETAILS} />);
