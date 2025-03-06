import Component from './component';
import { Observer } from '../interfaces';

export default class MOptionBase extends Component implements Observer {
    private readonly element: HTMLElement;
    private readonly checkbox: HTMLInputElement;
    private readonly isExclusive: boolean = false;

    constructor() {
        super();

        this.element =
            this.querySelector('label') ?? document.createElement('label');

        this.checkbox =
            this.querySelector('input') ?? document.createElement('input');

        this.isExclusive =
            this.getAttribute('data-exclusive') === 'true' || false;

        this.init();
    }

    private init(): void {
        this.addLocalEventListeners();
        this.question.addObserver(this);
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
                this.exclusiveClear(<CustomEvent>e);
                break;
            case 'keydown':
                this.onKeydown(<KeyboardEvent>e);
                break;
        }
    }

    public update(method: string, data: CustomEvent): void {
        if (method === 'exclusiveClear') {
            this.exclusiveClear(data);
        }
    }

    private changeState(check: boolean): void {
        if (check) {
            this.checkbox.checked = true;
            this.setAttribute('data-checked', 'true');
        } else {
            this.checkbox.checked = false;
            this.setAttribute('data-checked', 'false');
        }
    }

    private exclusiveClear(e: CustomEvent): void {
        if (e.target === this || !this.checkbox.checked) {
            return;
        }

        this.changeState(false);
    }

    private onChange(): void {
        if (this.isExclusive && this.checkbox.checked) {
            const exclusiveOn = new CustomEvent('exclusiveOn', {
                bubbles: true,
            });
            this.dispatchEvent(exclusiveOn);
        }
    }

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        // prevent radio buttons from de-selecting
        if (this.checkbox.checked && this.checkbox.type === 'radio') {
            return;
        }

        this.changeState(!this.checkbox.checked);
        this.onChange();
    }

    private onKeydown(e: KeyboardEvent): void {
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

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        // e.g. document.addEventListener('broadcastChange', ...);
    }

    public disconnectedCallback(): void {
        // e.g. document.removeEventListener('broadcastChange', ...);
    }
}
