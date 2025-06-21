import OOptionSublist from './o-option-sublist';
import { Subject } from '../interfaces';

export default class OOptionTabstrip extends OOptionSublist implements Subject {
    constructor() {
        super();
    }

    private checkCurrentSelection(): void {
        const currentTabSelection: HTMLInputElement | null = this.querySelector(
            'm-option-tab[data-checked="true"] input',
        );

        const currentReportedPage = '';

        if (!currentTabSelection || !currentReportedPage) return;

        const currentTabValue = currentTabSelection.value;

        if (currentTabValue !== currentReportedPage) {
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.checkCurrentSelection();
    }
}
