ReactDOM.createRoot(document.getElementById('root')).render(
  <ImageUpload
    header="Machine photo"
    handleUpload={(file) => console.log(file.name, file.type, file.size)}
  />
);
