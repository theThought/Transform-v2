import Component from './component';
import OOptionSublist from './o-option-sublist';
import { Observer } from '../interfaces';

export default class Option extends Component implements Observer {
    protected properties = {
        balance: {
            state: false,
            minwidth: '',
        },
        onesize: {
            state: false,
            maxwidth: '',
        },
    };

    protected element: HTMLInputElement | null = null;
    private sublist: OOptionSublist | null = null;
    private isExclusive = false;

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
            case 'sizeChangeWidth':
                this.setOnesizeWidth(data.detail.width);
                break;
            case 'sizeChangeHeight':
                this.setOnesizeHeight(data.detail.height);
                break;
        }
    }

    private setOnesizeWidth(width: number): void {
        this.style.width = `${width}px`;
    }

    private setOnesizeHeight(height: number): void {
        this.style.minHeight = `${height}px`;
    }

    private setMaxOneSize(): void {
        if (!this.properties.onesize.state) return;

        this.style.maxWidth = this.properties.onesize.maxwidth;
    }

    protected changeState(check: boolean): void {
        if (!this.element) return;

        if (check) {
            this.element.checked = true;
            this.dataset.checked = 'true';
        } else {
            this.element.checked = false;
            this.dataset.checked = 'false';
        }
    }

    private setReadonly(): void {
        if (this.element && this.element.readOnly) {
            this.setAttribute('data-readonly', 'true');
        }
    }

    private clearValue(e: CustomEvent): void {
        if (e.target === this) return;
        if (e.detail && this.qgroup != e.detail.qgroup) return;
        this.changeState(false);
    }

    private exclusiveClear(e: CustomEvent): void {
        if (!this.element) return;
        if (this.isExclusive) return;
        if (e.target === this) return;
        if (this.qgroup != e.detail.qgroup) return;

        this.changeState(false);
    }

    private clearExclusives(e: CustomEvent): void {
        if (!this.element) return;
        if (!this.isExclusive) return;
        if (this.qgroup != e.detail.qgroup) return;

        const eventTarget = e.target as HTMLElement;
        if (eventTarget.contains(this)) return;

        this.changeState(false);
    }

    protected onChange(): void {
        if (!this.element) return;

        if (this.isExclusive && this.element.checked) {
            const exclusiveOn = new CustomEvent('exclusiveOn', {
                bubbles: true,
                detail: this,
            });
            this.dispatchEvent(exclusiveOn);
        }

        if (this.isExclusive && !this.element.checked) {
            const exclusiveOff = new CustomEvent('exclusiveOff', {
                bubbles: true,
                detail: this,
            });
            this.dispatchEvent(exclusiveOff);
        }

        this.broadcastChange();
    }

    protected onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        if (!this.element) return;
        if (this.element.disabled) return;
        if (this.element.readOnly) return;

        this.element.focus();

        // prevent radio buttons from de-selecting
        if (this.element.checked && this.element.type === 'radio') return;

        this.changeState(!this.element.checked);
        this.onChange();
    }

    protected onKeydown(e: KeyboardEvent): void {
        if (!this.element) return;
        if (this.element.disabled) return;
        if (this.element.readOnly) return;

        // prevent radio buttons from de-selecting
        if (this.element.checked && this.element.type === 'radio') return;

        const target = e.target as HTMLInputElement;

        if (e.key === ' ') {
            this.changeState(!this.element.checked);
            this.onChange();
        } else if (target.type == 'text' && !this.element.checked) {
            this.changeState(true);
            this.onChange();
        }
    }

    private setBalanceWidth(): void {
        const minWidth: string = this.properties.balance.minwidth ?? '0';
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

    private informSizeChange(width: number, height: number): void {
        width = Math.ceil(width);
        height = Math.ceil(height);
        this.sublist?.checkOnesize(width, height);
    }

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        super.connectedCallback();

        this.sublist =
            this.closest('o-option-sublist') ??
            this.closest('o-option-tabstrip') ??
            this.closest('o-loop');
        this.isExclusive = this.getAttribute('data-exclusive') === 'true';

        this.addEventListener('click', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);

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
