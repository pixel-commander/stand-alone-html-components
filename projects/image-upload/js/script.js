const UPLOADER = document.querySelector('image-upload');

UPLOADER.handleUpload = (file) => {
  console.log(file.name, file.type, file.size);
};
