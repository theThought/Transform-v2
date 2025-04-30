import Component from './component';
import { Observer } from '../interfaces';

export default class OScale extends Component implements Observer {
    private observers: Observer[] = [];
    private unitContainer: HTMLElement | null = null;
    private element: HTMLInputElement | null = null;
    private isExclusive = false;
    private min = 1;
    private max = 10;
    private step = 1;

    constructor() {
        super();
    }

    private init(): void {
        this.addLocalEventListeners();
        this.setUnitBackground();
        this.configureWidth();
        this.setLabels();
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

    notifyObservers(method: string, e: CustomEvent): void {
        for (const observer of this.observers) {
            observer.update(method, e);
        }
    }

    private addLocalEventListeners(): void {
        this.addEventListener('click', this);
        this.addEventListener('broadcastChange', this);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'broadcastChange':
                this.onClick(<CustomEvent>e);
        }
    }

    private onClick(e: CustomEvent): void {
        e.stopPropagation();
        this.setValue(e.detail.dataValue);
        this.notifyObservers('newValue', e);
    }

    private configureWidth(): void {
        if (!this.element || !this.unitContainer) return;

        if (this.element.style.width) {
            this.unitContainer.style.maxWidth = this.element.style.width;
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

    private setValue(value: string): void {
        if (!this.element) return;

        if (this.element.value === value) {
            return;
        }

        this.element.value = value;
    }

    private setLabels(): void {
        if (!this.properties.hasOwnProperty('labels')) {
            return;
        }

        const labelProperties = this.properties.labels;

        const preLabel = labelProperties.pre || '';
        const postLabel = labelProperties.post || '';

        if (!preLabel && !postLabel) {
            return;
        }

        const isVertical = this.response.classList.contains(
            'o-question-scale-vertical',
        );

        if (isVertical) {
            if (postLabel) {
                const postElement = document.createElement('div');
                postElement.className = 'a-label-postlabel';
                postElement.innerHTML = postLabel
                    .replace(/%lt%/g, '<')
                    .replace(/%gt%/g, '>');
                this.response.insertBefore(
                    postElement,
                    this.response.firstChild,
                );
            }

            if (preLabel) {
                const preElement = document.createElement('div');
                preElement.className = 'a-label-prelabel';
                preElement.innerHTML = preLabel
                    .replace(/%lt%/g, '<')
                    .replace(/%gt%/g, '>');
                this.response.appendChild(preElement);
            }
        } else {
            const labelContainer = document.createElement('div');
            labelContainer.classList.add('o-label-container');

            if (preLabel) {
                const preElement = document.createElement('div');
                preElement.className = 'a-label-prelabel';
                preElement.innerHTML = preLabel
                    .replace(/%lt%/g, '<')
                    .replace(/%gt%/g, '>');
                labelContainer.appendChild(preElement);
            }

            if (postLabel) {
                const postElement = document.createElement('div');
                postElement.className = 'a-label-postlabel';
                postElement.innerHTML = postLabel
                    .replace(/%lt%/g, '<')
                    .replace(/%gt%/g, '>');
                labelContainer.appendChild(postElement);
            }

            const unitContainerWidth = this.element.style.width.length
                ? this.element.style.width
                : this.unitContainer.offsetWidth + 'px';
            labelContainer.style.width = unitContainerWidth;
            labelContainer.style.display = 'flex';
            labelContainer.style.justifyContent = 'space-between';
            labelContainer.style.marginBottom = '20px';

            this.response.appendChild(labelContainer);

            const specialCheckbox = this.response.querySelector(
                'div[data-exclusive="true"][data-questiongroup="' +
                    this.group +
                    '"]',
            );
            if (specialCheckbox) {
                this.response.appendChild(specialCheckbox);
            }
        }
    }

    public connectedCallback(): void {
        this.unitContainer = this.querySelector('.o-scale-unitcontainer');
        this.element = this.querySelector('input');
        if (!this.element) return;

        this.min = this.element.min ? parseInt(this.element.min) : this.min;
        this.max = this.element.max ? parseInt(this.element.max) : this.max;
        this.step = this.element.step ? parseInt(this.element.step) : this.step;

        this.init();
    }
}
