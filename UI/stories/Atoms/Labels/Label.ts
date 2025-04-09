class ALabelPre extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    get content() {
        return this.getAttribute('data-value');
    }

    set content(value) {
        if (!value) {
            value = '';
        }
        this.textContent = value;
    }

    render() {
        this.shadowRoot.textContent = this.content
    }
}

// Export the class
export default ALabelPre; 

