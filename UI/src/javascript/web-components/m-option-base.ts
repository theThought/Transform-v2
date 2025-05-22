import Component from './component';
import OOptionSublist from './o-option-sublist';
import { Observer } from '../interfaces';

export default class MOptionBase extends Component implements Observer {
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

    private element: HTMLElement | null = null;
    private checkbox: HTMLInputElement | null = null;
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

    private changeState(check: boolean): void {
        if (!this.checkbox) return;

        if (check) {
            this.checkbox.checked = true;
            this.setAttribute('data-checked', 'true');
        } else {
            this.checkbox.checked = false;
            this.setAttribute('data-checked', 'false');
        }
    }

    private setDisabled(): void {
        if (this.checkbox && this.checkbox.disabled) {
            this.setAttribute('data-disabled', 'true');
        }
    }

    private exclusiveClear(e: CustomEvent): void {
        if (!this.checkbox) return;
        if (this.isExclusive) return;
        if (e.target === this) return;

        this.changeState(false);
    }

    private clearExclusives(e: CustomEvent): void {
        if (!this.checkbox) return;
        if (!this.isExclusive) return;
        if (e.target === this) return;

        this.changeState(false);
    }

    private onChange(): void {
        if (!this.checkbox) return;

        if (this.isExclusive && this.checkbox.checked) {
            const exclusiveOn = new CustomEvent('exclusiveOn', {
                bubbles: true,
            });
            this.dispatchEvent(exclusiveOn);
        }

        if (this.isExclusive && !this.checkbox.checked) {
            const exclusiveOff = new CustomEvent('exclusiveOff', {
                bubbles: true,
            });
            this.dispatchEvent(exclusiveOff);
        }

        this.broadcastChange();
    }

    protected onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        if (!this.checkbox) return;

        // prevent radio buttons from de-selecting
        if (this.checkbox.checked && this.checkbox.type === 'radio') return;

        this.changeState(!this.checkbox.checked);
        this.onChange();
    }

    private onKeydown(e: KeyboardEvent): void {
        if (!this.checkbox) return;
        if (!this.element) return;

        if (e.key === ' ' && !this.checkbox.disabled) {
            if (this.checkbox.type === 'radio') {
                this.changeState(true);
                const enableExclusive = new CustomEvent(
                    this.qgroup + '_enableExclusive',
                    {
                        bubbles: true,
                        detail: this,
                    },
                );
                this.element.dispatchEvent(enableExclusive);
            } else {
                this.changeState(!this.checkbox.checked);
            }

            //this.broadcastChange();
        }
    }

    private setBalanceWidth(): void {
        if (!this.element || !this.properties.balance.state) return;

        const minWidth: string = this.properties.balance.minwidth ?? '0';
        this.element.style.minWidth = `${minWidth}`;
    }

    private informSizeChange(width: number, height: number): void {
        width = Math.ceil(width);
        height = Math.ceil(height);
        this.sublist?.checkOnesize(width, height);
    }

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        super.connectedCallback();

        this.element = this.querySelector('label');
        this.checkbox = this.querySelector('input');
        this.sublist =
            this.closest('o-option-sublist') ??
            this.closest('o-option-tabstrip');
        this.isExclusive = this.getAttribute('data-exclusive') === 'true';

        this.addEventListener('click', this);
        this.addEventListener('keydown', this);

        this.setBalanceWidth();
        this.setMaxOneSize();
        this.setDisabled();

        if (this.sublist) this.sublist.addObserver(this);

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

    public disconnectedCallback(): void {
        if (this.sublist) this.sublist.removeObserver(this);
    }
}
