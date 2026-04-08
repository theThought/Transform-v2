import { removeHTMLWhitespace } from './util';
import Component from './component';
import { Observer, Subject } from '../interfaces';

interface CustomProperties {
    separator?: boolean;
}

export default class OQuestion extends Component implements Subject {
    public properties: CustomProperties = {
        separator: true,
    };

    private observers: Observer[] = [];
    private responses: Record<string, any> = [];

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'broadcastChange':
                this.handleChange(e as CustomEvent);
                break;
            case 'click':
                this.onClick(e);
                break;
            case 'exclusiveOn':
                this.exclusiveOn(e as CustomEvent);
                break;
            case 'exclusiveOff':
                this.exclusiveOff(e as CustomEvent);
                break;
            case 'questionVisibility':
                this.handleVisibility(e as CustomEvent);
                break;
            case 'setSeparatorStyle':
                this.setSeparatorStyle(e as CustomEvent);
                break;
        }
    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        const index = this.observers.findIndex((obs) => obs === observer);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }

    public notifyObservers(method: string, detail: CustomEvent): void {
        this.observers.forEach((observer) => observer.update(method, detail));
    }

    private handleChange(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyOtherQuestions(e);
        this.updateAnswerCount(e);
        if (!e.detail.element.value) return;
        this.notifyObservers('clearExclusives', e);
    }

    private notifyOtherQuestions(e: CustomEvent): void {
        const questionChange = new CustomEvent('questionChange', {
            bubbles: true,
            detail: e.detail,
        });

        this.dispatchEvent(questionChange);
    }

    private exclusiveOn(e: CustomEvent): void {
        this.notifyObservers('clearValue', e);
    }

    private exclusiveOff(e: CustomEvent): void {
        this.notifyObservers('exclusiveRestore', e);
    }

    private updateAnswerCount(e: CustomEvent): void {
        this.responses[e.detail.qid] = e.detail.value;
    }

    private cleanEmptyLayout(): void {
        const layoutItems = this.querySelectorAll('.l-row');

        if (!layoutItems) {
            return;
        }

        layoutItems.forEach((element) => {
            const innerHTML = element.innerHTML;
            const newHTML = removeHTMLWhitespace(innerHTML);
            if (newHTML !== innerHTML) {
                element.innerHTML = newHTML;
            }
        });
    }

    private setSeparatorStyle(e: CustomEvent): void {
        e.stopPropagation(); // prevent nested questions from broadcasting upward and turning off all separators
        if (e.detail.separator) return;
        this.classList.add('question-no-separator');

        // the following event broadcasts upward to any loop
        if (this.properties.separator) return;
        const separatorEvent = new CustomEvent('setSeparatorStyle', {
            bubbles: true,
            detail: { separator: false, questionGroup: e.detail.questionGroup },
        });
        this.dispatchEvent(separatorEvent);
    }

    private handleVisibility(e: CustomEvent): void {
        e.stopPropagation();

        if (e.detail.collapse === false) {
            this.classList.add('do-not-collapse');
        }

        if (e.detail.hidden) {
            this.classList.add('unavailable');
        } else {
            this.classList.remove('unavailable');
        }
    }

    private onClick(e: Event): void {
        e.stopImmediatePropagation();

        const target = e.target as HTMLElement;

        if (target.tagName === 'TD') {
            const clickableElement = target.querySelector(
                'm-option-base, m-option-boolean, input[type="text"]',
            ) as HTMLElement;
            if (clickableElement) {
                clickableElement.focus();
                clickableElement.click();
            }
        }

        const clickEvent = new CustomEvent('questionClick', {
            bubbles: true,
            detail: this,
        });

        this.dispatchEvent(clickEvent);
    }

    private setCompleteFlag(): void {
        this.dataset.complete = 'true';
    }

    public connectedCallback(): void {
        this.cleanEmptyLayout();
        this.addEventListener('broadcastChange', this.handleEvent);
        this.addEventListener('clearChildren', this.handleEvent);
        this.addEventListener('click', this.handleEvent);
        this.addEventListener('exclusiveOn', this.handleEvent);
        this.addEventListener('exclusiveOff', this.handleEvent);
        this.addEventListener('questionVisibility', this.handleEvent);
        this.addEventListener('setSeparatorStyle', this.handleEvent);

        this.setCompleteFlag();
    }

    public disconnectedCallback(): void {
        document.removeEventListener('questionChange', this);
    }
}
