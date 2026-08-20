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
    this.classList.add('image-upload');
    this.classList.toggle('has-image', Boolean(this.#src));

    const children = [];

    if (this.header) {
      const header = document.createElement('header');
      header.dataset.area = 'header';
      header.textContent = this.header;
      children.push(header);
    }

    const image = document.createElement('img');
    image.dataset.area = 'main';
    image.alt = '';
    if (this.#src) image.src = this.#src;
    children.push(image);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', 'Remove image');
    children.push(remove);

    const link = document.createElement('a');
    link.dataset.area = 'footer';
    link.href = '#';
    link.textContent = this.label;
    children.push(link);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    children.push(input);

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

    this.replaceChildren(...children);
  }
}

customElements.define('image-upload', ImageUpload);
