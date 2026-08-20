class ActiveAlarmsTable extends HTMLElement {
  #data = [];
  #handleClick = null;
  #Icon = 'icons/bell.svg';
  #link_text = 'Open Issue';

  connectedCallback() {
    this.classList.add('active-alarms-table');
    this.render();
  }

  get data() {
    return this.#data;
  }

  set data(next) {
    this.#data = next || [];
    this.render();
  }

  get handleClick() {
    return this.#handleClick;
  }

  set handleClick(next) {
    this.#handleClick = next;
    this.render();
  }

  get Icon() {
    return this.#Icon;
  }

  set Icon(next) {
    this.#Icon = next || '';
    this.render();
  }

  get link_text() {
    return this.#link_text;
  }

  set link_text(next) {
    this.#link_text = next || '';
    this.render();
  }

  render() {
    const inner = document.createElement('ul');
    inner.classList.add('inner');

    this.#data.forEach((row) => {
      const item = document.createElement('li');

      const icon = document.createElement('img');
      icon.classList.add('icon');
      icon.src = this.#Icon;
      icon.alt = '';
      item.append(icon);

      const date = document.createElement('div');
      date.classList.add('date');
      date.textContent = row.date;
      item.append(date);

      if (this.#handleClick) {
        const link = document.createElement('a');
        link.classList.add('link');
        link.href = '#';
        link.textContent = this.#link_text;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          this.#handleClick(row);
        });
        item.append(link);
      }

      const brk = document.createElement('div');
      brk.classList.add('break');
      item.append(brk);

      const id = document.createElement('div');
      id.classList.add('id');
      id.textContent = row.id || '';
      item.append(id);

      const details = document.createElement('div');
      details.classList.add('details');
      details.textContent = row.description;
      item.append(details);

      const spacer = document.createElement('div');
      spacer.classList.add('spacer');
      item.append(spacer);

      inner.append(item);
    });

    this.replaceChildren(inner);
  }
}

customElements.define('active-alarms-table', ActiveAlarmsTable);
