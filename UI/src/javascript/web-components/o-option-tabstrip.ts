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

    private checkCurrentSelection(): void {
        if (!this.properties.tabstrip) return;

        const currentTab: HTMLInputElement | null = this.querySelector(
            'm-option-tab[data-checked="true"]',
        );

        if (!currentTab) return;

        if (currentTab.value !== this.properties.tabstrip.tab) {
            const desiredTabInput: HTMLInputElement | null = this.querySelector(
                `m-option-tab input[value='${this.properties.tabstrip.tab}']`,
            );
            const desiredTab = desiredTabInput?.parentElement;
            if (!desiredTab) return;
            currentTab.dataset.checked = 'false';
            desiredTab.dataset.checked = 'true';
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.checkCurrentSelection();
    }
}
