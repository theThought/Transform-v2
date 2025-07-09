import Component from './component';
import { Subject, Observer } from '../interfaces';
import { removeHTMLWhitespace } from './util';

export default class OScale extends Component implements Subject, Observer {
    protected properties = {
        labels: {
            pre: '',
            post: '',
        },
    };

    private observers: Observer[] = [];
    private element: HTMLInputElement | null = null;

    constructor() {
        super();
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

    notifyObservers(method: string, value: string): void {
        for (const observer of this.observers) {
            observer.update(method, value);
        }
    }

    public update(method: string): void {
        if (method === 'clearValue') {
            this.clearValue();
        }
        if (method === 'exclusiveRestore') {
            this.exclusiveRestore();
        }
    }

    private exclusiveRestore(): void {
        if (!this.element) return;
        this.restoreValue();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'scaleUnitClick':
                this.onClick(<CustomEvent>e);
        }
    }

    private onClick(e: CustomEvent): void {
        e.stopPropagation();
        this.setValue(e);
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

    private setValue(e: CustomEvent): void {
        if (!this.element) return;

        if (this.element.value === e.detail.dataValue) {
            return;
        }

        this.element.placeholder = e.detail.dataValue;
        this.element.value = e.detail.dataValue;
        this.notifyObservers('newValue', e.detail.dataValue);
        this.broadcastChange();
    }

    private clearValue(): void {
        if (!this.element) return;

        if (this.element.value === '') {
            return;
        }

        this.element.placeholder = this.element.value;
        this.element.value = '';
        this.notifyObservers('newValue', '');
    }

    private restoreValue(): void {
        if (!this.element) return;

        if (this.element.placeholder === '') {
            return;
        }

        this.element.value = this.element.placeholder;
        this.notifyObservers('newValue', this.element.value);
    }

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.response) {
            this.response.addObserver(this);
        }

        this.element = this.querySelector('input');
        this.addEventListener('scaleUnitClick', this);
        this.setLabels();
    }
}
