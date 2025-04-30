import Component from './component';

export default class ODropdown extends Component {
    private readonly element: HTMLInputElement | null;

    constructor() {
        super();

        this.element = this.querySelector('.a-input-dropdown');
        if (!this.element) return;
    }
}
