import Component from './component';
import { Observer, Subject } from '../interfaces';

export default class OCombobox extends Component implements Subject {
    protected element: HTMLInputElement | null = null;
    private observers: Observer[] = [];
    private explicitWidth: boolean = false;

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
        this.observers.push(observer);
        this.addPlaceholderToList();
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

        const placeholderData = new CustomEvent('addPlaceholderEntry', {
            bubbles: false,
            detail: {
                className: 'a-list-placeholder-hidden-prompt',
                content: this.element.placeholder,
            },
        });

        this.notifyObservers('addPlaceholderEntry', placeholderData);
    }

    private setWidthMethod(): void {
        if (!this.element) return;
        this.explicitWidth = !!this.element.style.width;
        if (this.explicitWidth) this.dataset.explicitWidth = 'true';
    }

    private sendCurrentWidth(): void {
        if (!this.element) return;

        const widthChange = new CustomEvent('widthChange', {
            bubbles: false,
            detail: {
                width: this.element.offsetWidth,
                explicit: this.explicitWidth,
            },
        });

        this.notifyObservers('widthChange', widthChange);
    }

    private monitorContainerWidth(): void {
        if (this.explicitWidth) return;

        const closestLayoutContainer = this.closest('div.l-column');
        const list = this.element?.nextElementSibling as HTMLElement;
        const listItems = list.querySelector('ul');
        const isGrid = !!this.closest('o-loop');

        if (!closestLayoutContainer) return;
        if (!listItems) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const widthChange = new CustomEvent('widthChange', {
                    bubbles: false,
                    detail: {
                        width: entry.borderBoxSize[0].inlineSize,
                        explicit: this.explicitWidth,
                    },
                });

                this.notifyObservers('widthChange', widthChange);

                if (listItems.offsetWidth > entry.contentRect.width) {
                    this.style.width = isGrid
                        ? `calc(${entry.contentRect.width}px - var(--space-3))`
                        : `${entry.contentRect.width}px`;
                } else {
                    this.style.width = isGrid
                        ? `calc(${listItems.offsetWidth}px - var(--space-3))`
                        : `${listItems.offsetWidth}px`;
                }
            }
        });

        observer.observe(closestLayoutContainer);
    }

    public addListEntry(
        list: HTMLElement,
        className: string,
        content: string,
    ): void {
        const listEntries = list.querySelector('ul');
        if (!listEntries) return;
        const newEntry = document.createElement('li');
        newEntry.classList.add(className);
        newEntry.innerHTML = `***${content}***`;
        listEntries.appendChild(newEntry);
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
        this.addPlaceholderToList();
        this.setWidthMethod();
        this.monitorContainerWidth();
        this.removeTabIndex();

        this.element?.addEventListener('blur', this);
        this.element?.addEventListener('input', this);
        this.element?.addEventListener('mousedown', this);
        this.element?.addEventListener('focusin', this);
        this.addEventListener('clickEvent', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
        this.addEventListener('labelChange', this.handleEvent);
    }
}
