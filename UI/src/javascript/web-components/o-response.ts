import { Subject, Observer } from '../interfaces';
import Component from './component';

export default class OResponse extends Component implements Subject {
    private observers: Observer[] = [];

    constructor() {
        super();
    }

    private init(): void {
        this.addLocalEventListeners();
    }

    private addLocalEventListeners(): void {
        this.addEventListener('exclusiveOn', this);
        this.addEventListener('exclusiveOff', this);
        this.addEventListener('broadcastChange', this);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'exclusiveOn':
                this.exclusiveOn(<CustomEvent>e);
                break;
            case 'exclusiveOff':
                this.exclusiveOff(<CustomEvent>e);
                break;
            case 'broadcastChange':
                this.handleChange(<CustomEvent>e);
                break;
        }
    }

    private exclusiveOn(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyObservers('exclusiveClear', e);
    }

    private exclusiveOff(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyObservers('exclusiveRestore', e);
    }

    private handleChange(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyObservers('exclusiveClear', e);
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

    public connectedCallback(): void {
        super.connectedCallback();
        this.init();
    }
}
