import Component from './component';

export default class OOptionSublist extends Component {
    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.setBalance();
        this.setOneSize();
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

    private setOneSize(): void {
        if (!this.properties.hasOwnProperty('onesize')) {
            return;
        }

        if (
            typeof this.properties.onesize !== 'object' ||
            !this.properties.onesize ||
            !('state' in this.properties.onesize) ||
            typeof this.properties.onesize.state !== 'boolean'
        ) {
            return;
        }

        const children = this.querySelectorAll(':scope > *:not(legend)');

        let tallest = 0;
        let widest = 0;

        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            const dims = getComputedStyle(element);
            const elementHeight = parseFloat(dims.height);
            const elementWidth = parseFloat(dims.width);
            const contentHeight = Math.ceil(elementHeight);
            const contentWidth = Math.ceil(elementWidth);

            if (isNaN(contentWidth) || isNaN(contentHeight)) {
                continue;
            }

            if (contentHeight > tallest) {
                tallest = contentHeight;
            }

            if (contentWidth > widest) {
                widest = contentWidth;
            }
        }
        console.log(`Widest ${widest}, tallest ${tallest}`);
    }
}
