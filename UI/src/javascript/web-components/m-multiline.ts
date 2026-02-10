import Component from './component';
import { Observer } from '../interfaces';

interface CustomProperties {
    paste?: boolean;
}

export default class MMultiline extends Component implements Observer {
    protected properties: CustomProperties = {};
    protected element: HTMLTextAreaElement | null = null;

    constructor() {
        super();
    }

    // Handle constructor() event listeners.
    public handleEvent(e: Event): void {
        switch (e.type) {
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

    // Clears the value when an exclusive option is enabled.
    private clearValue(e: CustomEvent): void {
        if (!this.element) return;
        const target = e.target as HTMLElement;

        if (target && (target === this || target.contains(this))) {
            return;
        }

        this.element.value = '';
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener('change', this.handleEvent);
        this.addEventListener('input', this.handleEvent);
        this.addEventListener('paste', this.handleEvent);

        if (this.response) this.response.addObserver(this);
    }

    public disconnectedCallback(): void {
        if (this.response) this.response.removeObserver(this);
    }
}
