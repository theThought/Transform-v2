import Component from './component';
import { Observer, Subject } from '../interfaces';
import { removeHTMLWhitespace } from './util';

export default class OSlider extends Component implements Observer, Subject {
    private observers: Observer[] = [];
    private element: HTMLInputElement | null = null;
    private min = 0;
    private max = 100;
    private step = 10;

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
        if (
            !this.properties.hasOwnProperty('ticklabels') ||
            typeof this.properties.ticklabels !== 'number'
        ) {
            return;
        }

        const labelsElement = this.querySelector('.m-label-marks');
        if (!labelsElement) return;

        let step = isNaN(this.properties.ticklabels)
            ? 10
            : this.properties.ticklabels;

        if (step === 0) {
            step = Math.floor(((this.max - this.min) / 100) * 10);
        }

        for (let i = this.min; i <= this.max; i = i + step) {
            const labelElement = document.createElement('span');
            labelElement.className = 'a-label-mark';
            labelElement.innerHTML = String(i);
            labelsElement.appendChild(labelElement);
        }
    }

    private terminatorButtons(): void {
        if (
            typeof this.properties.show !== 'object' ||
            !this.properties.show ||
            !('terminators' in this.properties.show) ||
            !this.properties.show.terminators
        ) {
            return;
        }

        this.classList.add('has-terminators');
    }

    // Set pre-/post-labels.
    private setLabels(): void {
        const elemPre = this.querySelector('.a-label-pre');
        const elemPost = this.querySelector('.a-label-post');

        if (elemPre && elemPost) {
            elemPre.innerHTML = removeHTMLWhitespace(elemPre.innerHTML);
            elemPost.innerHTML = removeHTMLWhitespace(elemPost.innerHTML);
        }

        if (!this.properties.hasOwnProperty('labels')) {
            return;
        }

        const labels = this.properties.labels as Record<string, unknown>;

        for (const [key, value] of Object.entries(labels)) {
            if (key === 'pre' && value) {
                if (elemPre) {
                    elemPre.textContent = value as string;
                }
            }

            if (key === 'post' && value) {
                if (elemPost) {
                    elemPost.textContent = value as string;
                }
            }
        }
    }

    private setProperties(): void {
        if (!this.element) return;

        this.min = this.element.min ? Number(this.element.min) : this.min;
        this.max = this.element.max ? Number(this.element.max) : this.max;
        this.element.step = this.properties.step
            ? String(this.properties.step)
            : String(this.step);
        this.step = this.properties.step
            ? Number(this.properties.step)
            : this.step;
    }

    private init(): void {
        this.addEventListener('notifySlider', this);
        this.addEventListener('incrementValue', this);
        this.addEventListener('decrementValue', this);
        this.setProperties();
        this.setLabels();
        this.tickLabels();
        this.terminatorButtons();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element =
            this.querySelector('input[type="hidden"]') ??
            this.querySelector('input[data-hidden="true"]');
        this.init();

        if (!this.response) return;
        this.response.addObserver(this);
    }
}
