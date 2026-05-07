import Component from './component';
import OOptionSublist from './o-option-sublist';
import { Observer } from '../interfaces';

interface CustomProperties {
    balance?: {
        state: boolean;
        minwidth?: string;
    };
    onesize: {
        state: boolean;
        maxwidth?: string;
    };
    submit?: boolean;
}

export default class Option extends Component implements Observer {
    protected properties: CustomProperties = {
        balance: {
            state: false,
            minwidth: '',
        },
        onesize: {
            state: false,
            maxwidth: '',
        },
    };

    protected element: HTMLInputElement | HTMLButtonElement | null = null;

    private sublist: OOptionSublist | null = null;
    public isExclusive = false;

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                this.onClick(e);
                break;
            case 'keydown':
                this.onKeydown(<KeyboardEvent>e);
                break;
        }
    }

    public update(method: string, data: CustomEvent): void {
        switch (method) {
            case 'exclusiveClear':
                this.exclusiveClear(data);
                break;
            case 'clearExclusives':
                this.clearExclusives(data);
                break;
            case 'clearValue':
                this.clearValue(data);
                break;
            case 'clearValueFromExternal':
                this.clearValueFromExternal(data);
                break;
            case 'sizeChangeWidth':
                this.setOnesizeWidth(data.detail.width);
                break;
            case 'sizeChangeHeight':
                this.setOnesizeHeight(data.detail.height);
                break;
        }
    }

    private setOnesizeWidth(width: number): void {
        this.style.inlineSize = `${width}px`;
    }

    private setOnesizeHeight(height: number): void {
        this.style.minBlockSize = `${height}px`;
    }

    private setMaxOneSize(): void {
        if (!this.properties.onesize.state) return;

        this.style.maxInlineSize = this.properties.onesize.maxwidth ?? 'auto';
    }

    private get input(): HTMLInputElement | null {
        return this.element instanceof HTMLInputElement ? this.element : null;
    }

    public changeState(check: boolean): void {
        if (!this.element) return;

        if ('checked' in this.element) {
            this.element.checked = check;
        }
        this.dataset.checked = String(check);
    }

    private setReadonly(): void {
        if (this.input?.readOnly) {
            this.setAttribute('data-readonly', 'true');
        }
    }

    private clearValue(e: CustomEvent): void {
        if (e.target === this) return;
        if (this.qgroup !== e.detail?.qgroup) return;

        this.changeState(false);
    }

    private clearValueFromExternal(e: CustomEvent): void {
        if (e.target === this) return;
        if (e.detail && this.qgroup == e.detail.qgroup) return;
        this.changeState(false);
    }

    protected exclusiveClear(e: CustomEvent): void {
        if (!this.element) return;
        if (this.isExclusive) return;
        if (e.target === this) return;
        if (this.contains(e.target as HTMLElement)) return;
        if (this.qgroup != e.detail.qgroup) return;

        this.changeState(false);
    }

    protected clearExclusives(e: CustomEvent): void {
        if (!this.element) return;
        if (!this.isExclusive) return;
        if (this.qgroup != e.detail.qgroup) return;

        const eventTarget = e.target as HTMLElement;
        if (eventTarget.contains(this)) return;

        this.changeState(false);
    }

    protected onChange(e?: Event): void {
        if (!this.element) return;
        if (e && !this.contains(e.target as HTMLElement)) return;

        if (this.isExclusive) {
            const eventName = this.input?.checked
                ? 'exclusiveOn'
                : 'exclusiveOff';
            this.dispatchEvent(
                new CustomEvent(eventName, { bubbles: true, detail: this }),
            );
        }

        this.broadcastChange();
    }

    protected onClick(e: Event): void {
        // the following allows the default click event to occur when the option
        // is selected via a remote label with a 'for' attribute, e.g. boolean.
        // We usually want to manage this process ourselves and prevent the
        // default. However, it's more complex when the event starts remotely.
        if (e.target !== this.element) {
            e.preventDefault();
        }
        e.stopPropagation();
        if (!this.element) return;
        if (this.element.disabled) return;
        if (this.input?.readOnly) return;
        if (e.target === this.element) return;

        this.element.focus();

        // prevent radio buttons from deselecting
        if (this.input?.checked && this.input.type === 'radio') return;

        this.changeState(!this.input?.checked);
        this.onChange(e);
    }

    protected onKeydown(e: KeyboardEvent): void {
        if (!this.element) return;
        if (this.element.disabled) return;
        if (this.input?.readOnly) return;

        // prevent radio buttons from deselecting
        if (this.input?.checked && this.input.type === 'radio') return;

        const target = e.target as HTMLInputElement;

        if (e.key === ' ') {
            e.preventDefault();
            this.changeState(!this.input?.checked);
            this.onChange(e);
        } else if (target.type == 'text' && !this.input?.checked) {
            this.changeState(true);
            this.onChange(e);
        }
    }

    private setBalanceWidth(): void {
        const minWidth: string = this.properties.balance?.minwidth ?? '0';
        this.style.minWidth = `${minWidth}`;
    }

    private setupResizeNotifications(): void {
        if (!this.sublist || !this.properties.onesize.state) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                this.informSizeChange(
                    entry.borderBoxSize[0].inlineSize,
                    entry.borderBoxSize[0].blockSize,
                );
            }
        });

        // start listening for size changes
        observer.observe(this);
    }

    public getChecked(): boolean {
        return this.input?.checked ?? false;
    }

    private informSizeChange(width: number, height: number): void {
        width = Math.ceil(width);
        height = Math.ceil(height);
        this.sublist?.checkOnesize(width, height);
    }

    private setExclusive(): void {
        this.isExclusive = this.getAttribute('data-exclusive') === 'true';
        if (this.isExclusive) {
            const icon = this.querySelector('span.a-icon-multistate');
            icon?.setAttribute('data-icon-type', 'diamond');
        }
    }

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        super.connectedCallback();

        this.sublist =
            this.closest('o-option-sublist') ??
            this.closest('o-option-tabstrip') ??
            this.closest('o-response');

        this.addEventListener('click', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);

        this.setExclusive();
        this.setBalanceWidth();
        this.setMaxOneSize();
        this.setReadonly();
        this.setupResizeNotifications();

        if (this.sublist) this.sublist.addObserver(this);
    }

    public disconnectedCallback(): void {
        if (this.sublist) this.sublist.removeObserver(this);
    }
}
