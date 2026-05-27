import Component from './component';
import OPaletteLoop from './o-palette-loop';
import { Observer, Subject } from '../interfaces';

export default class OPalette extends Component implements Subject {
    protected observers: Observer[] = [];
    private SubmitButton: HTMLElement | null = null;
    private CancelButton: HTMLElement | null = null;
    private loop: OPaletteLoop | null = null;
    private AnswersRemainCount: number = 0;
    private AnswerCurrentCount: number = 0;

    private configureSubmitButton(): void {
        this.SubmitButton = this.querySelector('button.a-button-icon.submit');

        if (!this.SubmitButton) {
            console.warn('Submit button not found');
            return;
        }

        this.SubmitButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('submit');
        });
    }

    private configureCancelButton(): void {
        this.CancelButton = this.querySelector('button.a-button-icon.cancel');

        if (!this.CancelButton) {
            console.warn('Cancel button not found');
            return;
        }

        this.CancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('cancel');
        });
    }

    private configureLoop(): void {
        this.loop = document.querySelector('o-palette-loop');
    }

    private updateRemainingAnswers(): void {
        if (!this.loop) return;

        this.AnswersRemainCount =
            this.loop.getExpectedAnswerCount() -
            this.loop.getCurrentAnswerCount();

        console.log(`Remaining answers: ${this.AnswersRemainCount}`);
    }

    public getAnswersRemainCount(): number {
        return this.AnswersRemainCount;
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

    public connectedCallback(): void {
        this.configureSubmitButton();
        this.configureCancelButton();
        this.configureLoop();
        this.updateRemainingAnswers();
    }
}
