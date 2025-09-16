import Component from './component';

interface FocusProperties {
    control?: boolean;
    question?: boolean;
}

interface CustomProperties {
    floatdetails?: boolean;
    focus?: FocusProperties;
    jumptoerror?: boolean;
    paste?: boolean;
    separator?: boolean;
    sidebyside?: number;
    tab?: string;
    validate?: boolean;
}

export default class AProperties extends Component {
    public properties: CustomProperties = {
        floatdetails: true,
        focus: {
            control: true,
            question: true,
        },
        paste: false,
        separator: true,
        sidebyside: 30,
    };

    constructor() {
        super();
    }

    private setFloatDetailsStyle(): void {
        if (this.properties.floatdetails) return;
        document.body.classList.add('details-inline');
    }

    private setFocusOnControlStyle(): void {
        if (!this.properties.focus?.control) return;
        document.body.classList.add('focus-control');
    }

    private setFocusOnQuestionStyle(): void {
        if (!this.properties.focus?.question) return;
        document.body.classList.add('focus-question');
    }

    private jumpToErrorMessage(): void {
        if (!this.properties.jumptoerror) return;

        const firstError: HTMLElement | null =
            document.querySelector('.a-label-error');
        if (!firstError) return;

        const itemWithError = firstError.dataset.questionId;

        const errorElement = itemWithError
            ? document.getElementById(itemWithError)
            : null;

        if (!errorElement) {
            // If no error element is found, scroll to the first error message.
            firstError.scrollIntoView({ block: 'center' });
        } else {
            // Scroll to the error element and focus it.
            errorElement.scrollIntoView({ block: 'center' });
            errorElement.focus();
        }
    }

    private setPastePermissions(): void {
        document.body.dataset.paste = this.properties.paste ? 'true' : 'false';
    }

    private setSeparatorStyle(): void {
        if (this.properties.separator) return;
        document.body.classList.add('question-no-separator');
    }

    private setSideBySideWidth(): void {
        if (!this.properties.sidebyside) return;

        document.documentElement.style.setProperty(
            '--column1-width',
            `${this.properties.sidebyside}%`,
        );
    }

    private sendCurrentTab(): void {
        if (!this.properties.tab) return;

        const tabEvent = new CustomEvent('currentTab', {
            bubbles: true,
            detail: this.properties.tab,
        });
        this.dispatchEvent(tabEvent);
    }

    private setValidateFormAttribute(): void {
        if (this.properties.validate) return;
        const form = this.closest('form');
        if (!form) return;
        form.setAttribute('novalidate', 'true');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setFloatDetailsStyle();
        this.setFocusOnControlStyle();
        this.setFocusOnQuestionStyle();
        this.jumpToErrorMessage();
        this.setPastePermissions();
        this.setSeparatorStyle();
        this.setSideBySideWidth();
        this.sendCurrentTab();
        this.setValidateFormAttribute();
    }
}
