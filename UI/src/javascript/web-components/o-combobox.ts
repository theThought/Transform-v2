import Component from './component';

export default class OCombobox extends Component {
    private readonly element: HTMLInputElement | null;

    constructor() {
        super();

        this.element = this.querySelector('.a-input-combobox');
    }
}
