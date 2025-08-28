import OOptionSublist from './o-option-sublist';

interface CustomProperties {
    balance: {
        state: boolean;
        minwidth: string;
    };
    onesize: {
        state: boolean;
        maxwidth: string;
    };
    tabstrip?: {
        question: string;
        tab: string;
    };
}

export default class OOptionTabstrip extends OOptionSublist {
    public properties: CustomProperties = {
        balance: {
            state: false,
            minwidth: '',
        },
        onesize: {
            state: false,
            maxwidth: '',
        },
    };

    constructor() {
        super();
    }

    private checkCurrentSelection(e: CustomEvent): void {
        const currentTab: HTMLInputElement | null = this.querySelector(
            'm-option-tab[data-checked="true"]',
        );

        if (!currentTab) return;

        if (currentTab.value !== e.detail) {
            const desiredTabInput: HTMLInputElement | null = this.querySelector(
                `m-option-tab input[value='${e.detail}']`,
            );
            const desiredTab = desiredTabInput?.parentElement;
            if (!desiredTab) return;
            currentTab.dataset.checked = 'false';
            desiredTab.dataset.checked = 'true';
        }
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'currentTab':
                this.checkCurrentSelection(e as CustomEvent);
                break;
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        document.addEventListener('currentTab', this);
    }
}
