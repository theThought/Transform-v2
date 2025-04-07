
class MScaleUnit extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    get dataValue() {
        return this.getAttribute('data-value');
    }

    set dataValue(value) {
        this.setAttribute('data-value', value);
    }

    render() {
    this.shadowRoot.innerHTML = `
        <class 'a-scale-unit' />
    `;
}
}

// Export the class
export default MScaleUnit; 

