import { Subject, Observer } from '../interfaces';
import Component from './component';

export default class OResponse extends Component implements Subject, Observer {
    private observers: Observer[] = [];

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.addLocalEventListeners();
    }

    private addLocalEventListeners(): void {
        this.addEventListener('exclusiveOn', this);
        this.addEventListener('broadcastChange', this);
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
        e.stopPropagation();
        this.notifyObservers('exclusiveClear', e);
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

    public update(event: string): void {
        console.log(event);
    }
}
