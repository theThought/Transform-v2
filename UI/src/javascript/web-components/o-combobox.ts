import Component from './component';
import { Observer, Subject } from '../interfaces';

export default class OCombobox extends Component implements Subject {
    protected element: HTMLInputElement | null = null;
    private observers: Observer[] = [];
    private explicitWidth: boolean = false;
    private widthConfigured = false;
    private containerResizeObserver: ResizeObserver | null = null;

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'blur':
                this.clearFocus(e as MouseEvent);
                break;
            case 'clickEvent':
                this.clearFocus(e as MouseEvent);
                break;
            case 'input':
                this.onInput(e as KeyboardEvent);
                break;
            case 'mousedown':
                this.toggleFocus();
                break;
            case 'focusin':
                this.setFocus();
                break;
            case 'labelChange':
                this.updateLabel(e as CustomEvent);
                break;
            case 'keydown':
                this.onKeydown(e as KeyboardEvent);
                break;
        }
    }

    private clearFocus(e?: MouseEvent): void {
        if (e && e.relatedTarget === this.querySelector('o-list')) return;
        this.classList.remove('focus');
        this.notifyVisibilityChange();
    }

    private setFocus(): void {
        if (this.classList.contains('focus')) return;
        this.classList.add('focus');
        this.sendCurrentWidth();
    }

    private toggleFocus(): void {
        this.classList.toggle('focus');
        this.notifyVisibilityChange();
        this.sendCurrentWidth();
    }

    private notifyVisibilityChange(): void {
        if (this.classList.contains('focus')) return;
        const hiddenEvent = new CustomEvent('hidden', {});
        this.notifyObservers('hidden', hiddenEvent);
    }

    addObserver(observer: Observer): void {
        if (!this.observers.includes(observer)) this.observers.push(observer);
        this.initializeListSizing();
    }

    private initializeListSizing(): void {
        if (
            !this.isConnected ||
            !this.widthConfigured ||
            !this.observers.length
        )
            return;

        // Registration guarantees that the list can receive the placeholder
        // synchronously before its content is measured.
        this.addPlaceholderToList();
        this.monitorContainerWidth();
    }

    removeObserver(observer: Observer): void {
        const obsIndex = this.observers.findIndex(
            (obs: Observer): boolean => observer === obs,
        );

        if (obsIndex < 0) {
            console.error('Observer does not exist!');
            return;
        }

        this.observers.splice(obsIndex, 1);
    }

    notifyObservers(method: string, detail: Event): void {
        for (const observer of this.observers) {
            observer.update(method, detail);
        }
    }

    private onKeydown(e: KeyboardEvent): void {
        if (this.isReadonly) return;

        switch (e.key) {
            case 'Tab':
            case 'Meta':
                break;
            case 'Enter':
                e.preventDefault();
                this.sendKeyToList(e);
                this.clearFocus();
                break;
            case 'Escape':
                this.clearFocus();
                this.sendKeyToList(e);
                break;
            case 'End':
            case 'Home':
            case 'ArrowUp':
            case 'ArrowDown':
                e.preventDefault(); // prevent caret from moving
                this.sendKeyToList(e);
                this.setFocus();
                break;
        }
    }

    private onInput(e: KeyboardEvent): void {
        if (this.isReadonly) return;

        switch (true) {
            case e.key === 'Tab':
            case e.key === 'Enter':
            case e.key === 'Escape':
            case e.key === 'End':
            case e.key === 'Home':
            case e.key === 'ArrowUp':
            case e.key === 'ArrowDown':
            case e.key === 'ArrowLeft':
            case e.key === 'ArrowRight':
            case e.key === 'Control':
            case e.key === 'Shift':
                break;
            case e.key === 'Backspace':
            case e.key === 'Delete':
                this.setFocus();
                this.sendValueToList();
                break;
            default:
                this.setFocus();
                this.sendValueToList();
                break;
        }
    }

    private sendKeyToList(e: KeyboardEvent): void {
        this.notifyObservers('keypress', e);
    }

    private sendValueToList(): void {
        const newValue = new CustomEvent('newValue', {
            bubbles: true,
            detail: this,
        });

        this.notifyObservers('newValue', newValue);
    }

    private updateLabel(e: CustomEvent): void {
        if (!this.element) return;
        this.element.value = e.detail.dataset.label;
    }

    private addPlaceholderToList(): void {
        if (!this.element?.placeholder?.length) return;
        if (this.querySelector('o-list .a-list-placeholder-hidden-prompt'))
            return;

        const placeholderData = new CustomEvent('addPlaceholderEntry', {
            bubbles: false,
            detail: {
                className: 'a-list-placeholder-hidden-prompt',
                content: this.element.placeholder,
            },
        });

        this.notifyObservers('addPlaceholderEntry', placeholderData);
    }

    private setWidthStrategy(): void {
        if (!this.element) return;
        this.explicitWidth = !!this.element.style.width;
        if (this.explicitWidth) this.dataset.explicitWidth = 'true';
    }

    private sendCurrentWidth(): void {
        if (!this.element) return;

        const widthChange = new CustomEvent('widthChange', {
            bubbles: false,
            detail: {
                width: this.getAppliedWidth(),
                explicit: this.explicitWidth || this.isInTable(),
            },
        });

        this.notifyObservers('widthChange', widthChange);
    }

    private monitorContainerWidth(): void {
        const closestLayoutContainer = this.closest('div.l-column');

        if (!closestLayoutContainer) return;

        this.applyWidthFromContainer(closestLayoutContainer);
        if (this.containerResizeObserver) return;

        this.containerResizeObserver = new ResizeObserver(() => {
            this.applyWidthFromContainer(closestLayoutContainer);
        });

        this.containerResizeObserver.observe(closestLayoutContainer);
    }

    private applyWidthFromContainer(container: Element): void {
        if (!this.element) return;

        const availableWidth = this.getAvailableContainerWidth(container);

        if (this.explicitWidth) {
            this.sendCurrentWidth();
            return;
        }

        const listWidth = this.getListContentWidth();
        // Loop spacing reduces the available space, not the content's width.
        const width = Math.min(
            listWidth,
            Math.max(0, this.getAdjustedWidth(availableWidth)),
        );

        this.style.width = `${width}px`;

        if (this.isInTable()) {
            this.element.style.width = `${width}px`;
        }

        const widthChange = new CustomEvent('widthChange', {
            bubbles: false,
            detail: {
                width,
                explicit: this.isInTable(),
            },
        });

        this.notifyObservers('widthChange', widthChange);
    }

    private getAvailableContainerWidth(container: Element): number {
        const width = container.getBoundingClientRect().width;

        return Math.max(0, width);
    }

    private getListContentWidth(): number {
        const list = this.querySelector('o-list');
        const listItems = list?.querySelector('ul');

        if (!list || !listItems) return this.getAppliedWidth();

        const clone = listItems.cloneNode(true) as HTMLElement;
        const listStyle = getComputedStyle(listItems);

        clone.style.blockSize = 'auto';
        clone.style.inlineSize = 'max-content';
        clone.style.maxBlockSize = 'none';
        clone.style.maxInlineSize = 'none';
        clone.style.minInlineSize = '0';
        clone.style.overflowX = 'hidden';
        clone.style.overflowY = 'scroll';
        clone.style.position = 'absolute';
        clone.style.visibility = 'hidden';
        clone.style.whiteSpace = 'nowrap';

        // Keep the clone in the same component context, so general list
        // styles, such as dropdown option padding, are included in the
        // measured width. Reserve scrollbar space on the clone even when the
        // live list does not overflow yet: opening it can constrain its height.
        this.styleMeasurementPlaceholder(clone, listStyle);
        list.appendChild(clone);

        // Allow for browser/font metric differences between the hidden
        // measurement clone and the live list. Firefox can measure this
        // Korean text several pixels narrower than other browsers.
        const width = Math.ceil(clone.getBoundingClientRect().width + 5);

        clone.remove();

        return width;
    }

    private getAppliedWidth(): number {
        return Math.ceil(this.getBoundingClientRect().width);
    }

    private styleMeasurementPlaceholder(
        clone: HTMLElement,
        listStyle: CSSStyleDeclaration,
    ): void {
        const placeholder = clone.querySelector<HTMLElement>(
            '.a-list-placeholder-hidden-prompt',
        );
        if (!this.element || !placeholder) return;

        const inputStyle = getComputedStyle(this.element);
        placeholder.style.whiteSpace = 'pre';

        // Make this entry represent the closed input, including arrow space.
        // The list already supplies its own padding and borders around the entry.
        placeholder.style.paddingLeft = `${Math.max(
            0,
            parseFloat(inputStyle.paddingLeft) +
                parseFloat(inputStyle.borderLeftWidth) -
                parseFloat(listStyle.paddingLeft) -
                parseFloat(listStyle.borderLeftWidth),
        )}px`;
        placeholder.style.paddingRight = `${Math.max(
            0,
            parseFloat(inputStyle.paddingRight) +
                parseFloat(inputStyle.borderRightWidth) -
                parseFloat(listStyle.paddingRight) -
                parseFloat(listStyle.borderRightWidth),
        )}px`;
    }

    private getAdjustedWidth(width: number): number {
        if (!this.closest('o-loop')) return width;

        const spacing = Number.parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
                '--space-3',
            ),
        );

        return width - (Number.isNaN(spacing) ? 0 : spacing);
    }

    private isInTable(): boolean {
        return !!this.closest('table');
    }

    private removeTabIndex(): void {
        this.querySelector('ul')?.setAttribute('tabindex', '-1');
    }

    protected setElement(): void {
        this.element = this.querySelector('.a-input-combobox');
        if (this.element && this.isReadonly) this.element.readOnly = true;
    }

    protected configureSetBehaviour(): void {
        //super.configureSetBehaviour();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setElement();
        if (!this.widthConfigured) {
            this.setWidthStrategy();
            this.widthConfigured = true;
        }
        // Existing registrations survive disconnection; resume sizing on reconnect.
        this.initializeListSizing();
        this.removeTabIndex();

        this.element?.addEventListener('blur', this);
        this.element?.addEventListener('input', this);
        this.element?.addEventListener('mousedown', this);
        this.element?.addEventListener('focusin', this);
        this.addEventListener('clickEvent', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
        this.addEventListener('labelChange', this.handleEvent);
    }

    public disconnectedCallback(): void {
        this.containerResizeObserver?.disconnect();
        this.containerResizeObserver = null;
    }
}
