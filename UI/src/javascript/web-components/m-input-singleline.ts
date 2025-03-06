import Component from './component';
import { Observer } from '../interfaces';

export default class MInputSingleline extends Component implements Observer {
    protected readonly element: HTMLInputElement;
    private readonly placeholder: string;
    private allowPaste = false;

    constructor() {
        super();

        this.element =
            this.querySelector('.a-input-singleline') ??
            document.createElement('input');

        this.placeholder = this.element.placeholder || '';

        this.init();
    }

    private init(): void {
        this.addLocalEventListeners();
        this.setLabels();
    }

    private addLocalEventListeners(): void {
        this.addEventListener('focusin', this);
        this.addEventListener('input', this);
    }

    // Handle constructor() event listeners.
    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'focusin':
                this.onFocusIn();
                break;
            case 'change':
            case 'input':
                this.broadcastChange();
        }
    }

    public update(method: string, data: CustomEvent): void {
        if (method === 'exclusiveClear') {
            this.exclusiveClear(data);
        }
    }

    private onFocusIn(): void {
        if (
            this.element.placeholder.length &&
            this.element.placeholder !== this.placeholder
        ) {
            this.element.value = this.element.placeholder;
            this.element.placeholder = this.placeholder;
            this.broadcastChange();
        }
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

    // Clears the value when an exclusive option is enabled.
    private exclusiveClear(e: CustomEvent): void {
        if (e.target === this) {
            return;
        }

        if (this.element.value) {
            this.element.placeholder = this.element.value;
            this.element.value = '';
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
        this.question.addObserver(this);
    }

    public disconnectedCallback(): void {
        this.question.removeObserver(this);
    }
}
