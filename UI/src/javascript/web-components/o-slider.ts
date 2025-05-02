export default class OSlider extends HTMLElement {
    // Triggers attributeChangedCallback() lifecycle method whenever attributes listed here change.
    static observedAttributes = ['attribute'];

    constructor() {
        super();
    }

    // Handle attribute changes.
    public attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
    ): void {
        console.log(
            `Attribute ${name} changed from ${oldValue} to ${newValue}.`,
        );
    }

    // Handle constructor() event listeners.
    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                break;
        }
    }
}
