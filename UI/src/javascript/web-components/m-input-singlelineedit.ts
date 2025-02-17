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

    // Set pre-/post-labels.
    private setLabels(): void {
        if (!this.properties.hasOwnProperty('labels')) {
            return;
        }

        const labels = this.properties.labels as Record<string, unknown>;

        for (const [key, value] of Object.entries(labels)) {
            if (key === 'pre' && value) {
                const elemPre = this.querySelector('.a-label-pre');
                if (elemPre) {
                    elemPre.textContent = value as string;
                }
            }

            if (key === 'post' && value) {
                const elemPost = this.querySelector('.a-label-post');
                if (elemPost) {
                    elemPost.textContent = value as string;
                }
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
