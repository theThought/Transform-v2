import Component from './component';

export default class OCombobox extends Component {
    private element: HTMLInputElement | null;

    constructor() {
        super();

        this.element = document.querySelector('.a-input-combobox');

        if (!this.element) return;

        this.init();
    }

    private init(): void {
        console.log('OCombobox: init...', this.element);

        this.broadcastChange('message from the child using Component class.');
    }
}
