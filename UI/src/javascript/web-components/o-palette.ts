import Component from './component';
import OPaletteLoop from './o-palette-loop';
import { Observer, Subject } from '../interfaces';

export default class OPalette extends Component implements Subject {
    protected observers: Observer[] = [];
    private Block: HTMLElement | null = null;
    private Complete: HTMLElement | null = null;
    private Empty: HTMLElement | null = null;
    private SubmitButton: HTMLElement | null = null;
    private CancelButton: HTMLElement | null = null;
    private loop: OPaletteLoop | null = null;
    private RemainingAnswerCount: number = 0;

    public handleEvent(e: CustomEvent): void {
        switch (e.type) {
            case 'cloneQuestion':
                this.cloneQuestion(e);
                break;
        }
    }

    private cloneQuestion(e: CustomEvent): void {
        e.stopImmediatePropagation();

        if (!this.Block) return;

        const elements: NodeListOf<HTMLElement> = this.Block.querySelectorAll(
            '[data-associate-type]',
        );

        elements.forEach((element) => {
            const associateType = element.dataset.associateType;
            const associateName = element.dataset.associateQuestion;
            let source: Node | null = null;

            switch (associateType) {
                case 'label':
                    source = document.querySelector(
                        `o-response[data-associate-question="${associateName}"] label[data-associate-type="${associateType}"]`,
                    );
                    break;
                case 'control':
                    source = document.createElement('o-question');
                    const control = <Node>(
                        document.querySelector(
                            `o-response[data-associate-question="${associateName}"]`,
                        )
                    );
                    if (!control) {
                        console.warn(
                            `Palette source element ${associateName} not found!`,
                        );
                        return;
                    }
                    source.appendChild(control);
                    break;
            }

            if (!source) {
                console.warn(
                    `Palette source element ${associateName} not found!`,
                );
                return;
            }

            element.appendChild(source);
            this.Block?.classList.remove('inactive');
        });
    }

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

        this.RemainingAnswerCount =
            this.loop.getExpectedAnswerCount() -
            this.loop.getCurrentAnswerCount();
    }

    public getRemainingAnswerCount(): number {
        return this.RemainingAnswerCount;
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
        const answerCount = new CustomEvent('answerCountChange', {
            detail: {
                remainingAnswerCount: this.getRemainingAnswerCount(),
            },
        });
        observer.update('answerCountChange', answerCount);
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

    private configureBlock(): void {
        this.Block = this.querySelector('.palette-inprogress');
        this.Block?.classList.add('inactive');
    }

    private configureComplete(): void {
        this.Complete = this.querySelector('.palette-complete');
        this.Complete?.classList.add('inactive');
    }

    private configureEmpty(): void {
        this.Empty = this.querySelector('.palette-empty');
        this.Empty?.classList.add('inactive');
    }

    public connectedCallback(): void {
        this.addEventListener('cloneQuestion', this);
        this.configureSubmitButton();
        this.configureCancelButton();
        this.configureLoop();
        this.configureEmpty();
        this.configureBlock();
        this.configureComplete();
        this.updateRemainingAnswers();
    }
}
