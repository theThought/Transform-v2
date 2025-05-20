import Component from './component';
import { Observer, Subject } from '../interfaces';

export default class OOptionSublist extends Component implements Subject {
    protected observers: Observer[] = [];
    protected properties = {
        balance: {
            state: false,
            minwidth: '',
        },
        onesize: {
            state: false,
            maxwidth: '',
        },
    };

    public tallest = 0;
    public widest = 0;
    public maxwidth = 0;

    constructor() {
        super();
    }

    private init(): void {
        this.setBalance();
        this.setMaxOneSize();
    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        const obsIndex = this.observers.findIndex(
            (obs: Observer): boolean => observer === obs,
        );

        if (obsIndex < 0) {
            console.error('Observer does not exist!');
            return;
        }

        this.observers.splice(obsIndex, 1);
    }

    public notifyObservers(method: string, detail: CustomEvent): void {
        for (const observer of this.observers) {
            observer.update(method, detail);
        }
    }

    private setBalance(): void {
        if (this.properties.balance.state) {
            this.classList.add('balance');
        } else {
            this.classList.remove('balance');
        }
    }

    public checkOnesize(width: number, height: number): void {
        if (
            width > this.widest &&
            (this.maxwidth === 0 || width <= this.maxwidth)
        ) {
            this.widest = width;
            const event = new CustomEvent('sizeChange', {
                detail: { width: width },
            });
            this.notifyObservers('sizeChangeWidth', event);
        }

        if (height > this.tallest) {
            this.tallest = height;
            const event = new CustomEvent('sizeChange', {
                detail: { height: height },
            });
            this.notifyObservers('sizeChangeHeight', event);
        }
    }

    private setMaxOneSize(): void {
        if (!this.properties.onesize.state) {
            return;
        }

        this.style.maxWidth = this.properties.onesize.maxwidth;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.init();
    }
}
