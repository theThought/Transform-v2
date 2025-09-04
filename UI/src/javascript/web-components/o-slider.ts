import Component from './component';
import { Observer, Subject } from '../interfaces';
import { removeHTMLWhitespace } from './util';

export default class OSlider extends Component implements Observer, Subject {
    protected properties = {
        show: {
            terminators: false,
            value: true,
        },
        labels: {
            position: 'outside',
            pre: '',
            post: '',
        },
        ticklabels: 0,
    };

    private observers: Observer[] = [];
    private element: HTMLInputElement | null = null;
    private min = 0;
    private max = 100;

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'notifySlider':
                this.onSliderValueChange(<CustomEvent>e);
                break;
            case 'incrementValue':
                this.incrementValue();
                break;
            case 'decrementValue':
                this.decrementValue();
                break;
            case 'requestInitialValue':
                this.sendInitialValue();
                break;
        }
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

    public update(method: string, data: CustomEvent): void {
        if (method === 'clearValue') {
            this.clearValue(data);
        }

        if (method === 'exclusiveRestore') {
            this.restoreData();
        }
    }

    private clearValue(e: CustomEvent): void {
        if (!this.element) return;

        if (e.target === this) {
            return;
        }

        if (this.element.value) {
            this.element.placeholder = this.element.value;
            this.element.value = '';
        }
    }

    private restoreData(): void {
        if (!this.element) return;

        if (this.element.placeholder.length) {
            this.element.value = this.element.placeholder;
            this.element.placeholder = '';
            this.broadcastChange();
        }
    }

    private sendInitialValue(): void {
        if (!this.element || !this.element.value.length) return;

        const initialValue = new CustomEvent('restoreInitialValue', {
            detail: { value: this.element.value },
        });

        this.notifyObservers('restoreInitialValue', initialValue);
    }

    private onSliderValueChange(e: CustomEvent): void {
        e.stopPropagation();
        if (!this.element) return;

        this.element.value = e.detail.element.value;
        this.element.placeholder = '';
        this.broadcastChange();
    }

    private incrementValue(): void {
        this.notifyObservers(
            'incrementValue',
            new CustomEvent('incrementValue'),
        );
    }

    private decrementValue(): void {
        this.notifyObservers(
            'decrementValue',
            new CustomEvent('decrementValue'),
        );
    }

    private terminatorButtons(): void {
        if (!this.properties.show.terminators) return;

        this.classList.add('has-terminators');
    }

    // Set pre-/post-labels.
    private setLabels(): void {
        let elemPre: HTMLElement | null = null;
        let elemPost: HTMLElement | null = null;

        if (!this.properties.labels) return;

        if (
            this.properties.labels.position === 'before' ||
            this.properties.labels.position === 'after'
        ) {
            elemPre = this.querySelector('.a-label-pre');
            elemPost = this.querySelector('.a-label-post');
        }

        if (this.properties.labels.position === 'outside') {
            elemPre = this.querySelector('.o-slider-container .a-label-pre');
            elemPost = this.querySelector('.o-slider-container .a-label-post');
        }

        if (elemPre && elemPost) {
            elemPre.innerHTML = removeHTMLWhitespace(elemPre.innerHTML);
            elemPost.innerHTML = removeHTMLWhitespace(elemPost.innerHTML);
        } else {
            return;
        }

        if (this.properties.labels.pre.length > 0) {
            elemPre.innerHTML = this.properties.labels.pre;
            this.classList.add('has-labels');
        }

        if (this.properties.labels.post.length > 0) {
            elemPost.innerHTML = this.properties.labels.post;
            this.classList.add('has-labels');
        }

        if (this.properties.labels.position === 'after') {
            this.classList.add('has-labels-position-after');
        }

        if (this.properties.labels.position === 'before') {
            this.classList.add('has-labels-position-before');
        }
    }

    private thumbValue(): void {
        if (!this.properties.show.value) return;
        this.classList.add('show-value');
    }

    private setProperties(): void {
        if (!this.element) return;
        this.min = this.element.min ? Number(this.element.min) : this.min;
        this.max = this.element.max ? Number(this.element.max) : this.max;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element =
            this.querySelector('input[type="hidden"]') ??
            this.querySelector('input[data-hidden="true"]');

        this.addEventListener('notifySlider', this.handleEvent);
        this.addEventListener('incrementValue', this.handleEvent);
        this.addEventListener('decrementValue', this.handleEvent);
        this.addEventListener('requestInitialValue', this.handleEvent);
        this.setProperties();
        this.setLabels();
        this.terminatorButtons();
        this.thumbValue();

        if (!this.response) return;
        this.response.addObserver(this);
    }
}
