import Component from './component';

export default class MList extends Component {
    protected properties = {
        filter: {},
    };

    protected element: HTMLInputElement | null = null;
    private isFiltered = false;
    private filterSource = '';
    private filterExclusions: string[] = [];

    constructor() {
        super();
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

        const selectedOption = <HTMLElement>e.target;
        if (
            selectedOption.tagName !== 'LI' ||
            selectedOption.dataset.selected === 'true'
        ) {
            return;
        }

        this.clearSelectedOption();
        this.setSelectedOption(selectedOption);
    }

    private clearSelectedOption(): void {
        const selectedOption = <HTMLElement>(
            this.querySelector('[data-selected="true"]')
        );
        if (selectedOption) {
            selectedOption.dataset.selected = 'false';
        }
    }

    private setSelectedOption(selectedOption: HTMLElement): void {
        selectedOption.dataset.selected = 'true';

        if (!this.element) return;
        this.element.value = `${selectedOption.dataset.value}`;
    }

    private processFilter(event: CustomEvent): void {
        // this question does not have a filter rule declared
        if (!this.isFiltered) {
            return;
        }

        // do not process events originating with the current question
        if (event.detail.group === this.qgroup) {
            return;
        }

        // the incoming question is not included in the list of filter sources
        if (
            event.detail.questionName.toLowerCase() !==
            this.filterSource.toLowerCase()
        ) {
            return;
        }

        // the incoming value has been found in the exclusion list
        if (
            typeof event.detail.checkbox !== 'undefined' &&
            this.filterExclusions.indexOf(event.detail.checkbox.value) >= 0
        ) {
            return;
        }

        if (typeof event.detail.droplist !== 'undefined') {
            const selectedElement =
                event.detail.droplist.querySelector('[data-selected]');

            if (selectedElement === null) {
                this.showOption(null, 'filter');
            } else {
                this.hideOption(
                    selectedElement.getAttribute('data-value'),
                    'filter',
                );
            }
        }
    }

    private hideOption(itemValue: string, hideMethod: string): void {
        const option = this.querySelector(
            ".hiddencontrol[value='" +
                itemValue +
                "'], [data-value='" +
                itemValue +
                "']",
        );

        if (!option) {
            console.warn(
                'Could not find the option ' + itemValue + ' to hide.',
            );
            return;
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

        this.addEventListener('click', this);
    }
}
