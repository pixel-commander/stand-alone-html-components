const UPLOAD_TEMPLATE = document.createElement('template');
UPLOAD_TEMPLATE.innerHTML = `
<div class="image-upload">
  <header data-area="header"></header>
  <img data-area="main" alt="">
  <button type="button" aria-label="Remove image">×</button>
  <a data-area="footer" href="#"></a>
  <input type="file" accept="image/*">
</div>
`;

class ImageUpload extends HTMLElement {
  #src = null;
  #handleUpload = null;

  connectedCallback() {
    this.render();
  }

  get header() {
    return this.getAttribute('header') || '';
  }

  set header(next) {
    this.setAttribute('header', next);
    this.render();
  }

  get label() {
    return this.getAttribute('label') || 'click here select an image';
  }

  set label(next) {
    this.setAttribute('label', next);
    this.render();
  }

  get src() {
    return this.#src;
  }

  set src(next) {
    if (next === this.#src) return;
    if (this.#src) URL.revokeObjectURL(this.#src);
    this.#src = next;
    this.render();
  }

  get handleUpload() {
    return this.#handleUpload;
  }

  set handleUpload(next) {
    this.#handleUpload = next;
  }

  render() {
    const upload = UPLOAD_TEMPLATE.content.cloneNode(true);
    const wrapper = upload.querySelector('.image-upload');

    wrapper.classList.toggle('has-image', Boolean(this.#src));

    const header = upload.querySelector('header');
    if (this.header) header.textContent = this.header;
    else header.remove();

    const image = upload.querySelector('img');
    if (this.#src) image.src = this.#src;

    const link = upload.querySelector('a');
    link.textContent = this.label;

    const remove = upload.querySelector('button');
    const input = upload.querySelector('input');

    remove.addEventListener('click', () => {
      this.src = null;
    });

    link.addEventListener('click', (event) => {
      event.preventDefault();
      input.click();
    });

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      this.src = URL.createObjectURL(file);
      if (this.#handleUpload) this.#handleUpload(file);
    });

    this.replaceChildren(upload);
  }
}

customElements.define('image-upload', ImageUpload);
