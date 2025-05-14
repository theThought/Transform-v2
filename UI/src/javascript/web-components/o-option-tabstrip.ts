import OOptionSublist from './o-option-sublist';
import { Subject } from '../interfaces';

export default class OOptionTabstrip extends OOptionSublist implements Subject {
    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'exclusiveOn':
                this.exclusiveOn(<CustomEvent>e);
                break;
        }
    }

    private exclusiveOn(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyObservers('clearExclusives', e);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('exclusiveOn', this);
    }
}
