
class MScaleUnit extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.setAttribute('class', 'a-scale-unit');
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

    render() {}
}

// Export the class
export default MScaleUnit; 

