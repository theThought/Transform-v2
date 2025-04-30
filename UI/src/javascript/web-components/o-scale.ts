import Component from './component';
import { Observer, Subject } from '../interfaces';

export default class OScale extends Component implements Observer, Subject {
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
        this.setClasses();
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

    notifyObservers(method: string, detail: CustomEvent): void {
        for (const observer of this.observers) {
            observer.update(method, detail);
        }
    }

    private addLocalEventListeners(): void {
        this.addEventListener('click', this);
        this.addEventListener('broadcastChange', this);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                this.onClick(e);
                break;
            case 'broadcastChange':
                this.onChange(<CustomEvent>e);
        }
    }

    private onChange(e: CustomEvent): void {
        e.stopPropagation();
        console.log(e);
    }

    public update(method: string, data: CustomEvent): void {
        if (method === 'exclusiveClear') {
            this.exclusiveClear(data);
        }
    }

    private exclusiveClear(e: CustomEvent): void {
        if (e.target === this.element) {
            return;
        }

        this.setValue('');
    }

    private onClick(e: Event): void {
        if (!this.unitContainer) return;

        this.unitContainer
            .querySelectorAll('.m-scale-unit')
            .forEach(function (unit) {
                unit.classList.remove('current-value');
            });
        const value = parseInt(e.target.getAttribute('data-value'));
        this.setValue(value);
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
        this.setClasses();

        if (this.isExclusive) {
            const enableExclusive = new CustomEvent(
                this.qgroup + '_enableExclusive',
                {
                    bubbles: true,
                    detail: this,
                },
            );
            this.element.dispatchEvent(enableExclusive);
        }

        this.broadcastChange();
    }

    private setClasses(): void {
        if (!this.element || !this.unitContainer) return;

        const value = parseInt(this.element.value);
        const self = this;

        this.unitContainer
            .querySelectorAll('.m-scale-unit')
            .forEach(function (unit) {
                const currentUnitValue = parseInt(
                    unit.getAttribute('data-value'),
                );

                if (currentUnitValue <= value) {
                    unit.classList.add('current-value');
                    if (typeof self.properties.unit !== 'undefined') {
                        unit.style.backgroundPositionX =
                            '-' + self.properties.unit.image.width;
                    }
                } else {
                    unit.classList.remove('current-value');
                    unit.style.backgroundPositionX = '0';
                }
            });
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

    private background(backgroundProperties): void {
        if (!this.response) return;

        const imageProperties = backgroundProperties.image;
        if (typeof imageProperties === 'undefined') {
            return;
        }
        const imageURL = imageProperties.url;
        if (typeof imageURL === 'undefined') {
            return;
        }
        const imageWidth =
            typeof imageProperties.width === 'undefined'
                ? ''
                : imageProperties.width;
        const imageHeight =
            typeof imageProperties.height === 'undefined'
                ? ''
                : imageProperties.height;
        let imageOffsetX = '0';
        let imageOffsetY = '0';
        const caption =
            typeof imageProperties.caption === 'undefined'
                ? ''
                : backgroundProperties.caption;
        if (typeof imageProperties.offset !== 'undefined') {
            imageOffsetX =
                typeof imageProperties.offset.x === 'undefined'
                    ? '0'
                    : backgroundProperties.offset.x;
            imageOffsetY =
                typeof imageProperties.offset.y === 'undefined'
                    ? '0'
                    : backgroundProperties.offset.y;
        }

        this.response.classList.add('has-container-background');
        this.response.style.height = imageHeight;
        this.response.style.width = imageWidth;
        this.response.style.backgroundImage = 'url("' + imageURL + '")';
        this.response.style.backgroundPositionX = imageOffsetX + 'px';
        this.response.style.backgroundPositionY = imageOffsetY + 'px';
        this.response.ariaLabel = caption;
    }

    public connectedCallback(): void {
        this.unitContainer = this.querySelector('.o-scale-unitcontainer');
        this.element = this.querySelector('input');
        if (!this.element) return;

        this.isExclusive = this.getAttribute('data-exclusive') === 'true';
        this.min = this.element.min ? parseInt(this.element.min) : this.min;
        this.max = this.element.max ? parseInt(this.element.max) : this.max;
        this.step = this.element.step ? parseInt(this.element.step) : this.step;

        this.init();
    }
}
