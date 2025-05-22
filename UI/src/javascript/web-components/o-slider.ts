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
        if (method === 'exclusiveClear') {
            this.exclusiveClear(data);
        }

        if (method === 'exclusiveRestore') {
            this.restoreData();
        }
    }

    private exclusiveClear(e: CustomEvent): void {
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

    private tickLabels(): void {
        if (this.properties.ticklabels === 0) return;

        const labelsElement = this.querySelector('.m-label-marks');
        if (!labelsElement) return;

        const step =
            this.properties.ticklabels > 0 ? this.properties.ticklabels : 10;

        for (let i = this.min; i <= this.max; i = i + step) {
            const labelElement = document.createElement('span');
            labelElement.className = 'a-label-mark';
            labelElement.innerHTML = String(i);
            labelsElement.appendChild(labelElement);
        }
    }

    private terminatorButtons(): void {
        if (!this.properties.show.terminators) return;

        this.classList.add('has-terminators');
    }

    // Set pre-/post-labels.
    private setLabels(): void {
        const elemPre = this.querySelector('.a-label-pre');
        const elemPost = this.querySelector('.a-label-post');

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

        this.addEventListener('notifySlider', this);
        this.addEventListener('incrementValue', this);
        this.addEventListener('decrementValue', this);
        this.setProperties();
        this.setLabels();
        this.tickLabels();
        this.terminatorButtons();
        this.thumbValue();

        if (!this.response) return;
        this.response.addObserver(this);
    }
}
