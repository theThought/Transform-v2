import Component from './component';
import { Observer, Subject } from '../interfaces';

export default class OCombobox extends Component implements Subject {
    private element: HTMLInputElement | null = null;
    private observers: Observer[] = [];

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'blur':
                this.clearFocus(e as MouseEvent);
                break;
            case 'mousedown':
                this.toggleFocus();
                break;
            case 'focusin':
                this.setFocus();
                break;
            case 'labelChange':
                this.updateLabel(<CustomEvent>e);
                break;
            case 'keydown':
                this.onKeydown(<KeyboardEvent>e);
                break;
            case 'keyup':
                this.onKeyup(<KeyboardEvent>e);
                break;
        }
    }

    private clearFocus(e?: MouseEvent): void {
        if (e && e.relatedTarget === this.querySelector('o-list')) return;
        this.classList.remove('focus');
    }

    private setFocus(): void {
        this.classList.add('focus');
    }

    private toggleFocus(): void {
        this.classList.toggle('focus');
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
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
        switch (e.key) {
            case 'Tab':
                break;
            case 'Enter':
                e.preventDefault();
                this.sendKeyToList(e);
                this.clearFocus();
                break;
            case 'Escape':
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

    private onKeyup(e: KeyboardEvent): void {
        switch (true) {
            case e.key === 'Backspace':
            case e.key === 'Delete':
                this.setFocus();
                this.sendValueToList();
                this.classList.remove('exact');
                break;
            case e.key.length > 1:
                break;
            default:
                this.setFocus();
                this.sendValueToList();
                this.classList.remove('exact');
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

        if (e.detail.mouseEvent) {
            this.element.focus();
            this.clearFocus();
        }
    }

    private setInputWidth(): void {
        if (!this.element) return;
        const currentSize = this.element.placeholder.length;
        if (currentSize) {
            this.element.style.width = `${currentSize}ch`;
        }
        const currentWidth = this.element.offsetWidth;
        const list = this.element.nextElementSibling as HTMLElement;
        if (!list) return;
        const currentListWidth = list.offsetWidth;
        if (currentListWidth < currentWidth) {
            list.style.minWidth = `${currentWidth}px`;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (!this.element) return;
                const newWidth = Math.max(
                    currentWidth,
                    entry.contentBoxSize[0].inlineSize,
                );
                this.element.style.maxWidth = `${newWidth}px`;
            }
        });

        resizeObserver.observe(list);
    }

    private removeTabIndex(): void {
        this.querySelector('ul')?.setAttribute('tabindex', '-1');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('.a-input-combobox');
        this.setInputWidth();
        this.removeTabIndex();
        this.element?.addEventListener('blur', this);
        this.element?.addEventListener('mousedown', this);
        this.element?.addEventListener('focusin', this);
        this.addEventListener('labelChange', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
        this.addEventListener('keyup', this.handleEvent);
    }
}
