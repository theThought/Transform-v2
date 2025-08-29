import Component from './component';

interface FocusProperties {
    question?: boolean;
    control?: boolean;
}

interface CustomProperties {
    validate?: boolean;
    floatdetails?: boolean;
    separator?: boolean;
    sidebyside?: number;
    paste?: boolean;
    jumptoerror?: boolean;
    tab?: string;
    focus?: FocusProperties;
}

export default class OProperties extends Component {
    public properties: CustomProperties = {
        validate: false,
        floatdetails: true,
        separator: true,
        sidebyside: 30,
        paste: true,
        jumptoerror: false,
    };

    constructor() {
        super();
    }

    private sendCurrentTab(): void {
        if (!this.properties.tab) return;

        const tabEvent = new CustomEvent('currentTab', {
            bubbles: true,
            detail: this.properties.tab,
        });
        this.dispatchEvent(tabEvent);
    }

    private setFormValidation(): void {
        if (this.properties.validate) return;
        const form = this.closest('form');
        if (!form) return;
        form.setAttribute('novalidate', 'true');
    }

    private setDetailsFloatStyle(): void {
        if (this.properties.floatdetails) return;
        document.body.classList.add('details-inline');
    }

    private setSeparatorStyle(): void {
        if (this.properties.separator) return;
        document.body.classList.add('question-no-separator');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setFormValidation();
        this.setDetailsFloatStyle();
        this.setSeparatorStyle();
        this.sendCurrentTab();
    }
}
