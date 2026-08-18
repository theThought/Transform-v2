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
    private editingRow: HTMLTableRowElement | null = null;
    private RemainingAnswerCount: number = 0;
    private isInitialized: boolean = false;

    private setState(state: 'empty' | 'inprogress' | 'complete'): void {
        this.Empty?.classList.toggle('inactive', state !== 'empty');
        this.Block?.classList.toggle('inactive', state !== 'inprogress');
        this.Complete?.classList.toggle('inactive', state !== 'complete');
    }

    public handleEvent(e: CustomEvent): void {
        switch (e.type) {
            case 'cloneQuestion':
                this.cloneQuestion(e);
                break;
            case 'answerCountChange':
                this.handleAnswerCountChange(e);
                break;
        }
    }

    private handleRecordEdit = (event: Event): void => {
        const detail = (event as CustomEvent<{ entry: HTMLElement }>).detail;
        const index = Number(detail?.entry?.getAttribute('data-index'));
        const rows = this.loop?.querySelectorAll<HTMLTableRowElement>('tr');

        if (!rows || !Number.isInteger(index) || index < 0 || !rows[index]) {
            return;
        }

        this.editingRow = rows[index];
        this.cloneQuestion(event as CustomEvent);

        const valuesByQuestion = new Map<string, string>();
        this.editingRow
            .querySelectorAll<HTMLInputElement>('input')
            .forEach((input) => {
                const response = input.closest<HTMLElement>('o-response');
                const question = response?.dataset.associateQuestion;
                if (question) valuesByQuestion.set(question, input.value);
            });

        this.Block?.querySelectorAll<HTMLInputElement>('input').forEach(
            (input) => {
                const response = input.closest<HTMLElement>('o-response');
                const question = response?.dataset.associateQuestion;
                const value = question ? valuesByQuestion.get(question) : null;
                if (value !== null && value !== undefined) {
                    input.value = value;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            },
        );
    };

    private handleAnswerCountChange(e: CustomEvent): void {
        this.RemainingAnswerCount = e.detail.remainingAnswerCount;
        this.notifyObservers('answerCountChange', e);

        // The loop can finish initialising after the palette. In that case,
        // use its first count event to make the empty state interactive.
        if (this.Block?.classList.contains('inactive')) {
            this.setState(
                this.RemainingAnswerCount === 0 ? 'complete' : 'empty',
            );
        }
    }

    private cloneQuestion(e: CustomEvent): void {
        e.stopImmediatePropagation();

        if (!this.Block) return;

        this.clearBlock();

        const elements: NodeListOf<HTMLElement> = this.Block.querySelectorAll(
            '[data-associate-type]',
        );

        elements.forEach((element) => {
            const associateType = element.dataset.associateType;
            const associateName = element.dataset.associateQuestion;
            let source: Node | null = null;

            const response = Array.from(
                document.querySelectorAll<HTMLElement>('o-response'),
            ).find(
                (candidate) =>
                    candidate.dataset.associateQuestion === associateName,
            );

            switch (associateType) {
                case 'label':
                    source =
                        response
                            ?.closest('o-question')
                            ?.querySelector(':scope > label')
                            ?.cloneNode(true) ?? null;
                    break;
                case 'control':
                    source = document.createElement('o-question');
                    if (!response) {
                        console.warn(
                            `Palette source element ${associateName} not found!`,
                        );
                        return;
                    }
                    source.appendChild(response.cloneNode(true));
                    break;
            }

            if (!source) {
                console.warn(
                    `Palette source element ${associateName} not found!`,
                );
                return;
            }

            element.appendChild(source);
        });

        this.setState('inprogress');
    }

    private clearBlock(): void {
        this.Block?.querySelectorAll('[data-associate-type]').forEach(
            (element) => {
                element.replaceChildren();
            },
        );
    }

    private configureSubmitButton(): void {
        this.SubmitButton = this.querySelector('button.a-button-icon.submit');

        if (!this.SubmitButton) {
            console.warn('Submit button not found');
            return;
        }

        this.SubmitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitRecord();
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
            this.cancelRecord();
        });
    }

    private submitRecord(): void {
        if (!this.loop || !this.Block) return;

        const nextRow = this.editingRow ?? this.loop.getNextAvailableRow();
        if (!nextRow) return;

        // Collect all inputs in the palette-inprogress block with their associate questions
        const inputsByQuestion = new Map<string, HTMLInputElement>();
        this.Block.querySelectorAll<HTMLInputElement>('input').forEach(
            (input) => {
                const response = input.closest<HTMLElement>('o-response');
                const associateQuestion = response?.dataset.associateQuestion;
                if (associateQuestion && input.value.trim()) {
                    inputsByQuestion.set(associateQuestion, input);
                }
            },
        );

        if (inputsByQuestion.size === 0) return;

        // Fill all cells in the next row that have matching associate questions
        let rowDataFound = false;
        nextRow.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
            const response = input.closest<HTMLElement>('o-response');
            const associateQuestion = response?.dataset.associateQuestion;
            if (associateQuestion && inputsByQuestion.has(associateQuestion)) {
                const sourceInput = inputsByQuestion.get(associateQuestion)!;
                input.value = sourceInput.value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                rowDataFound = true;
            }
        });

        if (!rowDataFound) return;

        if (this.editingRow) {
            nextRow
                .querySelectorAll<HTMLInputElement>('input')
                .forEach((input) => {
                    const response = input.closest<HTMLElement>('o-response');
                    const question = response?.dataset.associateQuestion;
                    if (question && !inputsByQuestion.has(question)) {
                        input.value = '';
                    }
                });
        }

        this.loop.refreshAnswerCount();
        this.clearBlock();
        this.editingRow = null;
        this.updateRemainingAnswers();
        this.setState(this.RemainingAnswerCount === 0 ? 'complete' : 'empty');

        const firstValue =
            Array.from(inputsByQuestion.values())[0]?.value || '';

        // Dispatch on window so all o-history elements can listen regardless of nesting
        window.dispatchEvent(
            new CustomEvent('paletteRecordCommitted', {
                bubbles: true,
                composed: true,
                detail: { value: firstValue, row: nextRow },
            }),
        );
    }

    private cancelRecord(): void {
        this.clearBlock();
        this.editingRow = null;
        // Cancelling does not change the loop count, but observers still need
        // the current count so the add button can become active again.
        this.updateRemainingAnswers();
        this.setState(this.RemainingAnswerCount === 0 ? 'complete' : 'empty');
        this.dispatchEvent(
            new CustomEvent('paletteRecordCancelled', { bubbles: true }),
        );
    }

    private configureLoop(): void {
        this.loop = document.querySelector('o-palette-loop');
    }

    private updateRemainingAnswers(): void {
        if (!this.loop) return;

        this.RemainingAnswerCount = this.loop.getRemainingAnswerCount();
        this.notifyObservers(
            'answerCountChange',
            new CustomEvent('answerCountChange', {
                detail: { remainingAnswerCount: this.RemainingAnswerCount },
            }),
        );
    }

    public getRemainingAnswerCount(): number {
        return this.RemainingAnswerCount;
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);

        // Only notify immediately if palette is already initialised
        // Otherwise, the observer will be notified once initialisation is complete
        if (this.isInitialized) {
            const answerCount = new CustomEvent('answerCountChange', {
                detail: {
                    remainingAnswerCount: this.getRemainingAnswerCount(),
                },
            });
            observer.update('answerCountChange', answerCount);
        }
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
    }

    private configureComplete(): void {
        this.Complete = this.querySelector('.palette-complete');
    }

    private configureEmpty(): void {
        this.Empty = this.querySelector('.palette-empty');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('cloneQuestion', this);
        this.addEventListener('answerCountChange', this);
        this.configureSubmitButton();
        this.configureCancelButton();
        this.configureLoop();
        window.addEventListener('paletteRecordEdit', this.handleRecordEdit);
        this.configureEmpty();
        this.configureBlock();
        this.configureComplete();

        queueMicrotask(() => {
            // Ensure loop is found
            if (!this.loop) this.configureLoop();

            // Wait for loop to finish initializing its row count
            if (this.loop && !this.loop.isLoopInitialized?.()) {
                queueMicrotask(() => {
                    this.updateRemainingAnswers();
                    this.setState(
                        this.RemainingAnswerCount === 0 ? 'complete' : 'empty',
                    );
                    this.isInitialized = true;
                    // Notify all observers that were added before initialization
                    this.notifyObservers(
                        'answerCountChange',
                        new CustomEvent('answerCountChange', {
                            detail: {
                                remainingAnswerCount: this.RemainingAnswerCount,
                            },
                        }),
                    );
                });
            } else {
                // Loop is already initialized or doesn't exist, update now
                this.updateRemainingAnswers();
                this.setState(
                    this.RemainingAnswerCount === 0 ? 'complete' : 'empty',
                );
                this.isInitialized = true;
                // Notify all observers that were added before initialization
                this.notifyObservers(
                    'answerCountChange',
                    new CustomEvent('answerCountChange', {
                        detail: {
                            remainingAnswerCount: this.RemainingAnswerCount,
                        },
                    }),
                );
            }
        });
    }

    public disconnectedCallback(): void {
        this.removeEventListener('cloneQuestion', this);
        this.removeEventListener('answerCountChange', this);
        window.removeEventListener('paletteRecordEdit', this.handleRecordEdit);
    }
}
