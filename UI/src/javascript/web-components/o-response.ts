import { Subject, Observer } from '../interfaces';
import Component from './component';

export default class OResponse extends Component implements Subject {
    public properties = {
        filter: {
            source: '',
            exclusions: new Array<string>(),
        },
    };

    private observers: Observer[] = [];

    constructor() {
        super();
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
            case 'questionChange':
                this.handleQuestionChange(<CustomEvent>e);
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
        this.notifyObservers('clearExclusives', e);
        this.notifyOtherQuestions(e);
    }

    private notifyOtherQuestions(e: CustomEvent): void {
        const questionChange = new CustomEvent('questionChange', {
            bubbles: true,
            detail: e.detail,
        });

        this.dispatchEvent(questionChange);
    }

    private handleQuestionChange(e: CustomEvent): void {
        // prevent questions from reacting to their own broadcast events
        if (e.target === this) return;

        // check whether this question needs to react to external changes
        if (this.properties.filter.source) {
            this.processFilter(e);
        }
    }

    private processFilter(e: CustomEvent): void {
        // the incoming question is not included in the list of filter sources
        if (
            e.detail.qgroup.toLowerCase() !==
            this.properties.filter.source.toLowerCase()
        ) {
            return;
        }

        this.notifyObservers('filter', e);
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

    private setupFiltering(): void {
        if (this.properties.filter.source.length === 0) {
            return;
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener('exclusiveOn', this);
        this.addEventListener('exclusiveOff', this);
        this.addEventListener('broadcastChange', this);
        document.addEventListener('questionChange', this);

        this.setupFiltering();
    }
}
