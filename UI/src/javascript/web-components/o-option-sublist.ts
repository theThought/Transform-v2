import Component from './component';
import { Observer, Subject } from '../interfaces';

export default class OOptionSublist extends Component implements Subject {
    private observers: Observer[] = [];
    public tallest = 0;
    public widest = 0;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.setBalance();
        this.setOneSize();
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    removeObserver(observer: Observer): void {
        const obsIndex = this.observers.findIndex(
            (obs: Observer): boolean => observer === obs,
        );

        if (obsIndex < 0) {
            console.error('Observer does not exist!');
            return;
        }

        this.observers.splice(obsIndex, 1);
    }

    notifyObservers(method: string, detail: CustomEvent): void {
        for (const observer of this.observers) {
            observer.update(method, detail);
        }
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

        if (this.properties.onesize.state) {
            this.classList.add('onesize');
        } else {
            this.classList.remove('onesize');
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

        this.tallest = tallest;
        this.widest = widest;
    }
}
