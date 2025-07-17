import Component from './component';
import { Observer, Subject } from '../interfaces';

export default class ODropdown extends Component implements Subject {
    private element: HTMLInputElement | null = null;
    private observers: Observer[] = [];

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'focusin':
                this.notifyObservers('focusin', e as CustomEvent);
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
                this.blur();
                break;
            case 'Enter':
                e.preventDefault();
                this.sendKeyToList(e);
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
                break;
            default:
                this.sendKeyToList(e);
                this.classList.remove('exact');
        }
    }

    private onKeyup(e: KeyboardEvent): void {
        switch (e.key) {
            case 'Tab':
            case null:
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
                break;
            default:
                break;
        }
    }

    private sendKeyToList(e: KeyboardEvent): void {
        this.notifyObservers('keypress', e);
    }

    private updateLabel(e: CustomEvent): void {
        if (!this.element) return;
        this.element.value = e.detail.dataset.label;
    }

    private configureElement(): void {
        if (!this.element) return;
        this.element.readOnly = true;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('.a-input-dropdown');
        this.addEventListener('focusin', this.handleEvent);
        this.addEventListener('labelChange', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
        this.addEventListener('keyup', this.handleEvent);
        this.configureElement();
    }
}
