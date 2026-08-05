import Component from './component';
import { Observer } from '../interfaces';
import { JsonObject } from './util';

interface CustomProperties extends JsonObject {
    paste: boolean;
}

export default class MMultiline extends Component implements Observer {
    protected properties: CustomProperties = {
        paste: true,
    };

    protected element: HTMLTextAreaElement | null = null;

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
            !this.properties.paste ||
            (!this.properties.paste && !globalPaste)
        ) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    private clearValue(e: CustomEvent): void {
        const target = e.target as HTMLElement;

        if (!this.element) return;
        if (target && (target === this || target.contains(this))) return;

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
