import Component from './component';
import { Subject, Observer } from '../interfaces';
import { removeHTMLWhitespace } from './util';

export default class OScale extends Component implements Subject, Observer {
    private observers: Observer[] = [];
    private unitContainer: HTMLElement | null = null;
    private element: HTMLInputElement | null = null;
    private min = 1;
    private max = 10;
    private step = 1;

    constructor() {
        super();
    }

    private init(): void {
        this.addLocalEventListeners();
        this.setLabels();
        this.setUnitBackground();
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
        if (method === 'exclusiveClear') {
            this.exclusiveClear();
        }
        if (method === 'exclusiveRestore') {
            this.exclusiveRestore();
        }
    }

    private exclusiveClear(): void {
        if (!this.element) return;
        this.clearValue();
    }

    private exclusiveRestore(): void {
        if (!this.element) return;
        this.restoreValue();
    }

    private addLocalEventListeners(): void {
        this.addEventListener('scaleUnitClick', this);
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

    private setUnitBackground(): void {
        if (!this.properties.hasOwnProperty('unit')) {
            return;
        }

        const unitProperties: object = this.properties.unit;
        const imageProperties = unitProperties.image;

        const imageURL = imageProperties.url;
        const imageWidth = imageProperties.width;
        const imageHeight = imageProperties.height;
        let imageOffsetX = '0';
        let imageOffsetY = '0';

        const caption =
            typeof imageProperties.caption === 'undefined'
                ? ''
                : unitProperties.caption;

        if (typeof imageProperties.offset !== 'undefined') {
            imageOffsetX =
                typeof imageProperties.offset.x === 'undefined'
                    ? '0'
                    : unitProperties.offset.x;
            imageOffsetY =
                typeof imageProperties.offset.y === 'undefined'
                    ? '0'
                    : unitProperties.offset.y;
        }

        if (typeof imageURL === 'undefined') {
            return;
        }

        this.classList.add('has-unit-background');
        const scaleUnits = this.querySelectorAll('.m-scale-unit');

        scaleUnits.forEach(function (unit) {
            unit.style.left = imageOffsetX + 'px';
            unit.style.top = imageOffsetY + 'px';
            unit.style.height = imageHeight;
            unit.style.width = imageWidth;
            unit.style.backgroundImage = 'url("' + imageURL + '")';
            unit.ariaLabel = caption;
        });
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

        this.unitContainer = this.querySelector('.o-scale-unitcontainer');

        this.element = this.querySelector('input');
        if (!this.element) return;

        this.min = this.element.min ? parseInt(this.element.min) : this.min;
        this.max = this.element.max ? parseInt(this.element.max) : this.max;
        this.step = this.element.step ? parseInt(this.element.step) : this.step;

        this.init();
    }
}
