import Component from './component';

export default class OCombobox extends Component {
    private element: HTMLInputElement | null = null;

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('.a-input-combobox');
    }
}
