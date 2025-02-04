import Component from './component';

export default class ODropdown extends Component {
    private element: HTMLInputElement | null;

    constructor() {
        super();

        this.element = document.querySelector('.a-input-dropdown');

        if (!this.element) return;

        this.init();
    }

    private init(): void {
        console.log('ODropdown: init...', this.element);

        this.broadcastChange('message from the child using Component class.');
    }
}
