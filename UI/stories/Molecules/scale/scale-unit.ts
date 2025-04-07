
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
        if (!value) {
            value = '1';
        }
        this.setAttribute('data-value', value);
        this.innerHTML = value;
    }

    render() {
        this.shadowRoot.innerHTML = `
        $(this.dataValue)
        `;
    }
}

// Export the class
export default MScaleUnit; 

