import Component from './component';
import { Observer, Subject } from '../interfaces';

export default class OOptionSublist
    extends Component
    implements Subject, Observer
{
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

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'exclusiveOn':
                this.exclusiveOn(<CustomEvent>e);
                break;
            case 'broadcastChange':
                this.handleChange(<CustomEvent>e);
                break;
        }
    }

    private exclusiveOn(e: CustomEvent): void {
        this.notifyObservers('exclusiveClear', e);
    }

    private handleChange(e: CustomEvent): void {
        this.notifyObservers('clearExclusives', e);
    }

    public update(method: string, data: CustomEvent): void {
        switch (method) {
            case 'clearExclusives':
                this.handleChange(data);
                break;
            case 'exclusiveClear':
                this.notifyObservers('exclusiveClear', data);
                break;
        }
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
            const e = new CustomEvent('sizeChange', {
                detail: { height: height },
            });
            this.notifyObservers('sizeChangeHeight', e);
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.response) this.response.addObserver(this);

        this.addEventListener('exclusiveOn', this);
        this.addEventListener('broadcastChange', this);
        this.setBalance();
    }
}
