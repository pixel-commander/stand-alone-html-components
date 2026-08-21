const LIST_TEMPLATE = document.createElement('template');
LIST_TEMPLATE.innerHTML = `
<div class="active-alarms-table flex min-h-0">
  <ul class="inner flex-auto list-none m-0 p-0 min-h-0 overflow-auto"></ul>
</div>
`;

const ALARM_TEMPLATE = document.createElement('template');
ALARM_TEMPLATE.innerHTML = `
<li class="flex flex-wrap gap-x-2">
  <img class="icon flex-none block w-4 h-4" alt="">
  <div class="date flex-auto"></div>
  <a class="link flex-none text-[#005eb8] no-underline whitespace-nowrap" href="#"></a>
  <div class="break basis-full h-0"></div>
  <div class="id flex-none whitespace-nowrap font-semibold"></div>
  <div class="details flex-auto"></div>
  <div class="spacer basis-full my-1.5 border-b border-[#e0e0e0]"></div>
</li>
`;

class ActiveAlarmsTable extends HTMLElement {
  #data = [];
  #handleClick = null;
  #Icon = 'icons/bell.svg';
  #link_text = 'Open Issue';

  connectedCallback() {
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
    const list = LIST_TEMPLATE.content.cloneNode(true);
    const inner = list.querySelector('.inner');

    this.#data.forEach((row) => {
      const alarm = ALARM_TEMPLATE.content.cloneNode(true);

      alarm.querySelector('.icon').src = this.#Icon;
      alarm.querySelector('.date').textContent = row.date;
      alarm.querySelector('.id').textContent = row.id || '';
      alarm.querySelector('.details').textContent = row.description;

      const link = alarm.querySelector('.link');
      if (this.#handleClick) {
        link.textContent = this.#link_text;
        link.addEventListener('click', (event) => {
          event.preventDefault();
          this.#handleClick(row);
        });
      } else {
        link.remove();
      }

      inner.append(alarm);
    });

    this.replaceChildren(list);
  }
}

customElements.define('active-alarms-table', ActiveAlarmsTable);
