import Component from './component';
import { removeHTMLWhitespace } from './util';
import { Observer } from '../interfaces';
import OOptionSublist from './o-option-sublist';

interface CustomProperties {
    labels?: {
        pre?: string;
        post?: string;
    };
    paste?: boolean;
}

export default class MSingleline extends Component implements Observer {
    protected properties: CustomProperties = {};
    protected element: HTMLInputElement | null = null;
    private sublist: OOptionSublist | null = null;
    private initialPlaceholder = '';

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
                break;
            case 'paste':
                this.onPaste(e);
                break;
        }
    }

    public update(method: string, data: CustomEvent): void {
        switch (method) {
            case 'clearValue':
                this.clearValue(data);
                break;
            case 'clearText':
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
        const elemPre = this.querySelector('[class*="a-label-pre"]');
        const elemPost = this.querySelector('[class*="a-label-post"]');

        if (elemPre && elemPost) {
            elemPre.innerHTML = removeHTMLWhitespace(elemPre.innerHTML);
            elemPost.innerHTML = removeHTMLWhitespace(elemPost.innerHTML);
        } else {
            return;
        }

        if (this.properties?.labels?.pre) {
            elemPre.innerHTML = this.properties.labels.pre;
            this.classList.add('has-labels');
        }

        if (this.properties?.labels?.post) {
            elemPost.innerHTML = this.properties.labels.post;
            this.classList.add('has-labels');
        }
    }

    // Clears the value when an exclusive option is enabled.
    private clearValue(e: CustomEvent): void {
        if (!this.element) return;
        const target = e.target as HTMLElement;

        if (target && (target === this || target.contains(this))) {
            return;
        }

        if (this.element.value) {
            this.element.placeholder = this.element.value;
            this.element.value = '';
        }
    }

    private onPaste(e: Event): void {
        const globalPaste = document.body.dataset.paste
            ? document.body.dataset.paste === 'true'
            : false;

        if (
            this.properties.paste === false ||
            (typeof this.properties.paste === 'undefined' && !globalPaste)
        ) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        super.connectedCallback();

        this.sublist = this.closest('o-option-sublist');

        if (!this.element) return;
        this.initialPlaceholder = this.element.placeholder;

        this.addEventListener('focusin', this.handleEvent);
        this.addEventListener('input', this.handleEvent);
        this.addEventListener('paste', this.handleEvent);

        this.setLabels();

        if (this.response) this.response.addObserver(this);
        if (this.sublist) this.sublist.addObserver(this);
    }

    public disconnectedCallback(): void {
        if (this.response) this.response.removeObserver(this);
        if (this.sublist) this.sublist.removeObserver(this);
    }
}
