import Component from './component';

export default class MInputSinglelineedit extends Component {
    private element: HTMLInputElement | null;
    private allowPaste = false;

    constructor() {
        super();

        this.element = this.querySelector('.a-input-singlelineedit');

        if (!this.element) return;

        this.init();
    }

    private init(): void {
        this.addLocalEventListeners();
        this.setLabels();
        this.setInputType();
    }

    private addLocalEventListeners(): void {
        //this.element.addEventListener('keyup', this, false);
        //this.element.addEventListener('change', this, false);
        //this.element.addEventListener('input', this, false);
        //this.element.addEventListener('click', this, false);
        //this.element.addEventListener('focusin', this, false);
        //this.element.addEventListener('focusout', this, false);
        //this.element.addEventListener('keydown', this, false);
        //this.element.addEventListener('paste', this, false);
    }

    // Set the appropriate 'type' attribute on <input> based on custom properties.
    private setInputType(): void {
        if (!this.properties.hasOwnProperty('type')) {
            return;
        }

        let inputType = this.properties.type;

        switch (inputType) {
            case 'date':
                inputType = 'date';
                break;
            case 'number':
                inputType = 'number';
                break;
            default:
                inputType = 'text';
                break;
        }

        try {
            if (this.element) {
                this.element.type = inputType as string;
            }
        } catch (e) {
            console.error('Unknown input type', e);
        }
    }

    // Set pre-/post-labels.
    // TODO: See https://app.clickup.com/t/8697h5cc4?comment=90120097089630&threadedComment=90120097249142
    private setLabels(): void {
        if (!this.properties.hasOwnProperty('labels')) {
            return;
        }

        const labels = this.properties.labels as Record<string, unknown>;

        for (const [key, value] of Object.entries(labels)) {
            if (key === 'pre' && value) {
                const elemPre = document.createElement('span');
                elemPre.classList.add('a-label-prelabel');
                elemPre.textContent = value as string;

                this.insertBefore(elemPre, this.element);
            }

            if (key === 'post' && value) {
                const elemPre = document.createElement('span');
                elemPre.classList.add('a-label-postlabel');
                elemPre.textContent = value as string;

                this.appendChild(elemPre);
            }
        }
    }

    // Handle constructor() event listeners.
    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'paste':
                this.onPaste(e);
                break;
            case 'keydown':
                this.onKeydown(e);
                break;
            case 'click':
                this.onClick(e);
                break;
            case 'keyup':
            case 'change':
                this.onChange(e);
                break;
            case 'input':
                this.onInput(e);
                break;
            case 'clearEntries':
                this.clearEntriesFromExternal(e);
                break;
            case 'restoreEntries':
                this.restoreEntries(e);
                this.makeAvailable();
                break;
            case 'focusin':
                this.onFocusIn(e);
                break;
            case 'focusout':
                this.onFocusOut();
                break;
            case this.group + '_enableExclusive':
                this.onEnableExclusive(e);
                break;
            case 'broadcastChange':
                this.processVisibilityRulesFromExternalTrigger(e);
                this.processCalculations(e);
                break;
        }
    }

    // TODO: Query the parent form instead of reading the attribute directly?
    private onPaste(e: Event): void {
        const parentForm = this.element?.closest('form');

        if (!parentForm) {
            return;
        }

        const pageAllowPaste = parentForm.getAttribute('data-paste');

        if (
            !this.allowPaste ||
            (pageAllowPaste === 'false' && !this.allowPaste)
        ) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        // e.g. document.addEventListener('broadcastChange', ...);
    }

    public disconnectedCallback(): void {
        // e.g. document.removeEventListener('broadcastChange', ...);
    }
}
