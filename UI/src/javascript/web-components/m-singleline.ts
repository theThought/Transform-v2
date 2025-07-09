import Component from './component';
import { removeHTMLWhitespace } from './util';
import { Observer } from '../interfaces';

export default class MSingleline extends Component implements Observer {
    protected properties = {
        labels: {
            pre: '',
            post: '',
        },
    };

    protected element: HTMLInputElement | null = null;
    private initialPlaceholder = '';
    private allowPaste = false;

    constructor() {
        super();
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
        switch (method) {
            case 'clearValue':
                this.clearValue(data);
                break;
            case 'exclusiveRestore':
                this.onFocusIn();
                break;
        }
    }

    private onFocusIn(): void {
        if (!this.element) return;

        if (
            this.element.placeholder.length &&
            this.element.placeholder !== this.initialPlaceholder
        ) {
            this.element.value = this.element.placeholder;
            this.element.placeholder = this.initialPlaceholder;
            this.broadcastChange();
        }
    }

    // Set pre-/post-labels.
    private setLabels(): void {
        const elemPre = this.querySelector('.a-label-pre');
        const elemPost = this.querySelector('.a-label-post');

        if (elemPre && elemPost) {
            elemPre.innerHTML = removeHTMLWhitespace(elemPre.innerHTML);
            elemPost.innerHTML = removeHTMLWhitespace(elemPost.innerHTML);
        } else {
            return;
        }

        if (this.properties.labels.pre.length > 0) {
            elemPre.innerHTML = this.properties.labels.pre;
            this.classList.add('has-labels');
        }

        if (this.properties.labels.post.length > 0) {
            elemPost.innerHTML = this.properties.labels.post;
            this.classList.add('has-labels');
        }
    }

    // Clears the value when an exclusive option is enabled.
    private clearValue(e: CustomEvent): void {
        if (!this.element) return;

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
        super.connectedCallback();

        this.element = this.querySelector('input');
        if (!this.element) return;

        this.initialPlaceholder = this.element.placeholder;

        this.addEventListener('focusin', this);
        this.addEventListener('input', this);

        this.setLabels();

        if (this.response) this.response.addObserver(this);
    }

    public disconnectedCallback(): void {
        if (this.response) this.response.removeObserver(this);
    }
}
