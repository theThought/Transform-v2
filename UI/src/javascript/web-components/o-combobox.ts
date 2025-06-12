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
            case 'Tab': // tab key
                this.blur();
                break;
            case 'Enter': // enter key
                e.stopImmediatePropagation();
                e.preventDefault();
                break;
            case 'End': // end
            case 'Home': // home
            case 'ArrowUp': // up arrow
            case 'ArrowDown': // down arrow
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
            case 'Tab': // tab key
            case null:
                break;
            case 'Enter': // enter key
                break;
            case 'Escape': // escape key
                this.blur();
                break;
            case 'ArrowLeft': // left
            case 'ArrowRight': // right
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

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('.a-input-combobox');
        this.addEventListener('labelChange', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
        this.addEventListener('keyup', this.handleEvent);
    }
}
