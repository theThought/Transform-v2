import Component from './component';
import { Observer } from '../interfaces';

export default class MList extends Component implements Observer {
    public properties = {
        filter: {
            source: '',
            exclusions: new Array<string>(),
        },
    };

    protected element: HTMLInputElement | null = null;

    constructor() {
        super();
    }

    public update(method: string, data: CustomEvent): void {
        switch (method) {
            case 'filter':
                this.processFilter(data);
                break;
        }
    }

    private restoreSelection(): void {
        if (!this.element) return;

        const option = <HTMLElement>(
            this.querySelector('[data-value="' + this.element.value + '"]')
        );

        if (option === null) {
            return;
        }

        this.setOption(option);
        this.setLabel(option);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                this.onClick(e);
                break;
        }
    }

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        const clickedOption = <HTMLElement>e.target;

        if (
            clickedOption.tagName !== 'LI' ||
            clickedOption.dataset.selected === 'true'
        ) {
            return;
        }

        this.clearSelectedOptions();
        this.setOption(clickedOption);
        this.setValue(clickedOption);
        this.setLabel(clickedOption);
    }

    private clearFilteredOptions(): void {
        const filteredOptions = <NodeListOf<HTMLElement>>(
            this.querySelectorAll('.hidden-filter')
        );

        filteredOptions.forEach((option) => {
            option.classList.remove('hidden-filter');
        });
    }

    private clearSelectedOptions(): void {
        const selectedOptions = <NodeListOf<HTMLElement>>(
            this.querySelectorAll('[data-selected="true"]')
        );

        selectedOptions.forEach((option) => {
            this.clearOption(option);
        });
    }

    private clearOption(option: HTMLElement): void {
        option.dataset.selected = 'false';
        option.ariaSelected = 'false';
    }

    private setOption(option: HTMLElement): void {
        option.dataset.selected = 'true';
        option.ariaSelected = 'true';
    }

    private clearValue(): void {
        if (!this.element || !this.element.value.length) return;

        this.element.value = '';
        this.broadcastChange();
    }

    private setValue(option: HTMLElement): void {
        if (!this.element || this.element.value === option.dataset.value)
            return;

        this.element.value = `${option.dataset.value}`;
        this.broadcastChange();
    }

    private clearLabel(): void {
        this.dataset.label = '';
        this.broadcastLabelChange();
    }

    private setLabel(option: HTMLElement): void {
        this.dataset.label = `${option.innerHTML}`;
        this.broadcastLabelChange();
    }

    private broadcastLabelChange(): void {
        const labelChange = new CustomEvent('labelChange', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(labelChange);
    }

    private processFilter(e: CustomEvent): void {
        let excluded = false;
        const matchingElement = <HTMLElement>(
            this.querySelector(
                `[data-value="${e.detail.element.value}"]:not(.hidden-filter)`,
            )
        );

        // the incoming value has been found in the exclusion list
        if (
            typeof e.detail.element.value !== 'undefined' &&
            this.properties.filter.exclusions.indexOf(e.detail.element.value) >=
                0
        ) {
            excluded = true;
        }

        if (matchingElement === null || excluded) {
            this.showOption(null, 'filter');
        } else {
            this.clearFilteredOptions();
            this.hideOption(matchingElement, 'filter');
        }
    }

    private hideOption(option: HTMLElement, hideMethod: string): void {
        if (option.dataset.selected === 'true') {
            this.clearOption(option);
            this.clearValue();
            this.clearLabel();
        }

        if (hideMethod === 'filter') {
            option.classList.add('hidden-filter');
        } else {
            option.classList.add('hidden-rule');
        }
    }

    private showOption(itemValue: string | null, hideMethod: string): void {
        let option;

        if (itemValue === null) {
            option = this.querySelector('.hidden-filter');
        } else {
            option = this.querySelector(
                "[value='" + itemValue + "'], [data-value='" + itemValue + "']",
            );
        }

        if (option === null) {
            return;
        }

        if (hideMethod === 'filter') {
            option.classList.remove('hidden-filter');
        } else {
            option.classList.remove('hidden-rule');
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.element = this.querySelector('input');
        this.restoreSelection();

        this.addEventListener('click', this);
        if (this.response) this.response.addObserver(this);
    }
}
