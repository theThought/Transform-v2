import Component from './component';
import { Observer } from '../interfaces';

export default class MList extends Component implements Observer {
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

        const matchingListItem = <HTMLElement>(
            this.querySelector('[data-value="' + this.element.value + '"]')
        );

        if (matchingListItem === null) {
            return;
        }

        this.setSelectedOption(matchingListItem);
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

        this.clearSelectedOption();
        this.setSelectedOption(clickedOption);
    }

    private clearSelectedOption(): void {
        const selectedOption = <HTMLElement>(
            this.querySelector('[data-selected="true"]')
        );

        if (selectedOption) {
            selectedOption.dataset.selected = 'false';
        }
    }

    private showFilteredOptions(): void {
        const filteredOptions = <NodeListOf<HTMLElement>>(
            this.querySelectorAll('.hidden-filter')
        );

        filteredOptions.forEach((option) => {
            option.classList.remove('hidden-filter');
        });
    }

    private setSelectedOption(selectedOption: HTMLElement): void {
        if (!this.element) return;

        selectedOption.dataset.selected = 'true';
        this.element.value = `${selectedOption.dataset.value}`;
        this.broadcastChange();
    }

    private processFilter(e: CustomEvent): void {
        const matchingElement = <HTMLElement>(
            this.querySelector(
                `[data-value="${e.detail.element.value}"]:not(.hidden-filter)`,
            )
        );

        if (matchingElement === null) {
            this.showOption(null, 'filter');
        } else {
            this.showFilteredOptions();
            this.hideOption(matchingElement, 'filter');
        }
    }

    private hideOption(element: HTMLElement, hideMethod: string): void {
        if (hideMethod === 'filter') {
            element.classList.add('hidden-filter');
        } else {
            element.classList.add('hidden-rule');
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
