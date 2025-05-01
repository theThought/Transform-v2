import Component from './component';
import OOptionSublist from './o-option-sublist';
import { Observer } from '../interfaces';

export default class MOptionBase extends Component implements Observer {
    private element: HTMLElement | null = null;
    private checkbox: HTMLInputElement | null = null;
    private sublist: OOptionSublist | null = null;
    private isExclusive = false;

    constructor() {
        super();
    }

    private init(): void {
        this.addLocalEventListeners();
        this.setBalanceWidth();
    }

    private addLocalEventListeners(): void {
        this.addEventListener('click', this);
        this.addEventListener('exclusiveClear', this, true);
        this.addEventListener('keydown', this);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                this.onClick(e);
                break;
            case 'exclusiveClear':
                this.clearExclusives(<CustomEvent>e);
                break;
            case 'keydown':
                this.onKeydown(<KeyboardEvent>e);
                break;
        }
    }

    public update(method: string, data: CustomEvent): void {
        if (method === 'clearExclusives') {
            this.clearExclusives(data);
        }
        if (method === 'sizeChangeWidth') {
            this.setOnesizeWidth(data.detail.width);
        }
        if (method === 'sizeChangeHeight') {
            this.setOnesizeHeight(data.detail.height);
        }
    }

    private setOnesizeWidth(width: number): void {
        this.style.width = `${width}px`;
    }

    private setOnesizeHeight(height: number): void {
        this.style.minHeight = `${height}px`;
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

    private clearExclusives(e: CustomEvent): void {
        if (!this.checkbox) return;

        if (e.target === this || !this.checkbox.checked) {
            return;
        }

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
    }

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        if (!this.checkbox) return;

        // prevent radio buttons from de-selecting
        if (this.checkbox.checked && this.checkbox.type === 'radio') {
            return;
        }

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
        if (
            !this.element ||
            typeof this.properties.balance !== 'object' ||
            !this.properties.balance ||
            !('minwidth' in this.properties.balance) ||
            typeof this.properties.balance.minwidth !== 'string'
        ) {
            return;
        }

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
        this.sublist = this.closest('o-option-sublist');
        this.isExclusive = this.getAttribute('data-exclusive') === 'true';

        this.init();

        if (this.response) {
            this.response.addObserver(this);
        }

        if (
            !this.sublist ||
            typeof this.properties.onesize !== 'object' ||
            !this.properties.onesize ||
            !('state' in this.properties.onesize) ||
            !this.properties.onesize.state
        ) {
            return;
        }
        this.sublist.addObserver(this);

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
        if (this.response) {
            this.response.removeObserver(this);
        }

        if (this.sublist) {
            this.sublist.removeObserver(this);
        }
    }
}
