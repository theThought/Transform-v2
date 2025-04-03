import Component from './component';

export default class OOptionSublist extends Component {
    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.setBalance();
    }

    private setBalance(): void {
        if (!this.properties.hasOwnProperty('balance')) {
            return;
        }

        const state: boolean = this.properties.balance.state === true;

        if (state) {
            this.classList.add('balance');
        } else {
            this.classList.remove('balance');
        }
    }
}
