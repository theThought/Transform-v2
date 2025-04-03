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

        if (
            typeof this.properties.balance !== 'object' ||
            !this.properties.balance ||
            !('state' in this.properties.balance) ||
            typeof this.properties.balance.state !== 'boolean'
        ) {
            return;
        }

        if (this.properties.balance.state) {
            this.classList.add('balance');
        } else {
            this.classList.remove('balance');
        }
    }
}
