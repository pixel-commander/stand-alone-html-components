class MachineOverviewWidget extends HTMLElement {
  connectedCallback() {
    this.classList.add('machine-overview-widget');
  }
}

customElements.define('machine-overview-widget', MachineOverviewWidget);
