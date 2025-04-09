export default class AScaleUnit extends HTMLElement {
    constructor() {
        super();
    }

    get dataValue(): null | string {
        return this.getAttribute('data-value');
    }

    set dataValue(value: string) {
        if (!value) {
            value = '1';
        }
        this.setAttribute('data-value', value);
        this.textContent = this.dataValue ?? '0';
    }
}
