import OOptionSublist from './o-option-sublist';

export default class OOptionTabstrip extends OOptionSublist {
    public properties = {
        balance: {
            state: false,
            minwidth: '',
        },
        onesize: {
            state: false,
            maxwidth: '',
        },
    };

    private currentTab: HTMLInputElement | null = null;

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'currentTab':
                this.updateCurrentTab(e as CustomEvent);
                break;
            case 'submitForm':
                this.handleSubmit(e as CustomEvent);
                break;
        }
    }

    private updateCurrentTab(e: CustomEvent): void {
        if (!this.currentTab) return;
        const currentTabValue =
            this.currentTab.querySelector('input')?.value.toLowerCase() ?? '';

        if (currentTabValue !== e.detail.toLowerCase()) {
            const desiredTabInput: HTMLInputElement | null = this.querySelector(
                `m-option-tab input[value='${e.detail}' i]`,
            );
            const desiredTab = desiredTabInput?.parentElement;
            if (!desiredTab) return;
            this.currentTab.dataset.checked = 'false';
            desiredTab.dataset.checked = 'true';
        }
    }

    private handleSubmit(e: CustomEvent): void {
        const selectedID = e.detail.dataset.questionId;
        const currentID = this.currentTab?.dataset.questionId;

        if (!selectedID || !currentID) return;

        if (selectedID > currentID) {
            this.submitForward();
        }

        if (selectedID < currentID) {
            this.submitBackward();
        }
    }

    private submitForward(): void {
        const form = this.closest('form');
        if (form) form.submit();
    }

    private submitBackward(): void {
        const previousButton: HTMLButtonElement | null =
            document.querySelector('.a-button-prev');

        if (!previousButton || previousButton.type !== 'submit') return;
        previousButton.click();
    }

    private setCurrentTab(): void {
        this.currentTab = this.querySelector(
            'm-option-tab[data-checked="true"]',
        );
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setCurrentTab();
        document.addEventListener('currentTab', this);
        this.addEventListener('submitForm', this.handleEvent);
    }
}
