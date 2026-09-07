import Component from './component';
import VisibilityRulesProcessor from './visibility-rules-processor';

export default class OPaletteHistoryEntry extends Component {
    private EditButton: HTMLElement | null | undefined = undefined;
    private DeleteButton: HTMLElement | null | undefined = undefined;
    private visibilityRulesProcessor = new VisibilityRulesProcessor();

    constructor() {
        super();

        const template: HTMLTemplateElement | null =
            document.querySelector('o-history template');

        if (!template) return;

        const style = document.createElement('style');
        style.innerHTML = `
            :host {
                display: flex;
                justify-content: space-between;
                transition: background-color 150ms ease-in-out;
            }
            :host(.active) {
                background: var(--color-bg-system-warning-subtle, #fff6e5);
            }
            button {
                opacity: 0;
                pointer-events: none;
                transition: opacity 150ms ease-in-out;
            }
            :host(.active) button {
                opacity: 1;
                pointer-events: all;
            }
            .l-col-history {
                display: flex;
            }
            ftd {
                color: var(--color-secondary);
                cursor: default;
            }
            ftd.unavailable {
                display: none;
            }
            ftd.unavailable.do-not-collapse {
                display: initial;
                visibility: hidden;
            }
            .a-button-icon {
                width: 36px;
                height: 33px;
            }
            .a-button-icon.delete {
                background-color: var(--color-bg-neutral-primary, #ffffff);
                background-image: url('./build/static/images/delete.svg');
                background-position: center;
                background-repeat: no-repeat;
            }
            .a-button-icon.edit {
                background-color: var(--color-bg-neutral-primary, #ffffff);
            }
            .a-button-icon.reset {
                background-color: transparent;
                background-image: url('./build/static/images/restart.svg');
                background-position: center;
                background-repeat: no-repeat;
            }
            .l-col-history {
                justify-content: end;
            }`;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(): void {
        this.shadowRoot?.querySelectorAll('ftd').forEach((ftd) => {
            this.processVisibility(ftd);

            if (ftd.getAttribute('type') !== 'variable') return;
            const associateControl = ftd.getAttribute('data-associate-control');
            if (!associateControl) return;

            ftd.textContent =
                this.getAttribute(`data-label-${associateControl}`) ||
                this.getAttribute(`data-${associateControl}`) ||
                '';
        });
    }

    private processVisibility(ftd: Element): void {
        const properties = this.parsePropertiesFrom(ftd as HTMLElement);
        const rules =
            Object.keys(properties).length > 0
                ? (properties as ReturnType<typeof this.getVisibilityRules>)
                : this.getVisibilityRules(ftd.getAttribute('data-properties'));
        const visibleRule = rules.visible?.rules ?? '';
        const invisibleRule = rules.invisible?.rules ?? '';

        ftd.classList.remove('unavailable', 'do-not-collapse');
        if (!visibleRule && !invisibleRule) return;

        let available = true;
        let collapse = true;
        const valueScope = this.getVisibilityValueScope();
        if (!valueScope) return;
        if (visibleRule) {
            const parsedRule =
                this.visibilityRulesProcessor.parseVisibilityRules(visibleRule);
            this.visibilityRulesProcessor.getQuestionValues(valueScope);
            available = this.visibilityRulesProcessor.evaluateRule(
                this.visibilityRulesProcessor.insertQuestionValuesIntoRule(
                    parsedRule,
                ),
            );
            collapse = rules.visible?.collapse ?? true;
        }
        if (invisibleRule) {
            const parsedRule =
                this.visibilityRulesProcessor.parseVisibilityRules(
                    invisibleRule,
                );
            this.visibilityRulesProcessor.getQuestionValues(valueScope);
            if (
                this.visibilityRulesProcessor.evaluateRule(
                    this.visibilityRulesProcessor.insertQuestionValuesIntoRule(
                        parsedRule,
                    ),
                )
            ) {
                available = false;
            }
            collapse = rules.invisible?.collapse ?? collapse;
        }

        if (!available) {
            ftd.classList.add('unavailable');
            if (!collapse) ftd.classList.add('do-not-collapse');
        }
    }

    // TODO: Change o-page to o-palette or o-complex when Kevin has manufactured a wrapper around the new question type.
    private getVisibilityValueScope(): HTMLTableRowElement | null {
        const rowIndex = Number(this.getAttribute('data-index'));
        const loop = this.closest('o-page')?.querySelector('o-palette-loop');
        const rows = loop?.querySelectorAll<HTMLTableRowElement>('tr');

        return Number.isInteger(rowIndex) && rowIndex >= 0 && rows
            ? (rows[rowIndex] ?? null)
            : null;
    }

    private getVisibilityRules(value: string | null): {
        visible?: { rules: string; collapse?: boolean };
        invisible?: { rules: string; collapse?: boolean };
    } {
        if (!value) return {};
        try {
            return JSON.parse(value.replace(/&quot;/g, '"'));
        } catch {
            const result: ReturnType<typeof this.getVisibilityRules> = {};
            (['visible', 'invisible'] as const).forEach((type) => {
                const match = value.match(
                    new RegExp(
                        `['"]?${type}['"]?\\s*:\\s*\\{.*?['"]?rules['"]?\\s*:\\s*'(.+?)'\\s*\\}`,
                        'i',
                    ),
                );
                if (match) {
                    result[type] = {
                        rules: match[1],
                        collapse: !/collapse\s*:\s*false/i.test(match[0]),
                    };
                }
            });
            return result;
        }
    }

    public handleEvent(event: Event): void {
        if (event.type === 'questionChange') this.render();
    }

    private configureEditButton(): void {
        this.EditButton = this.shadowRoot?.querySelector(
            'button.a-button-icon.edit',
        );

        if (!this.EditButton) {
            console.warn('Edit button not found');
            return;
        }

        this.EditButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(
                new CustomEvent('paletteRecordEdit', {
                    bubbles: true,
                    detail: {
                        value: this.getAttribute('data-value') || '',
                        entry: this,
                    },
                }),
            );
        });
    }

    private configureDeleteButton(): void {
        this.DeleteButton = this.shadowRoot?.querySelector(
            'button.a-button-icon.delete',
        );

        if (!this.DeleteButton) {
            console.warn('Delete button not found');
            return;
        }

        this.DeleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.dispatchEvent(
                new CustomEvent('paletteRecordDelete', {
                    bubbles: true,
                    detail: {
                        value: this.getAttribute('data-value') || '',
                        entry: this,
                    },
                }),
            );
        });
    }

    private configureSelection(): void {
        this.addEventListener('click', () => {
            this.parentElement
                ?.querySelectorAll('o-palette-history-entry.active')
                .forEach((entry) => entry.classList.remove('active'));
            this.classList.add('active');
        });
    }

    public connectedCallback(): void {
        document.addEventListener('questionChange', this);
        this.render();
        this.configureEditButton();
        this.configureDeleteButton();
        this.configureSelection();
    }

    public disconnectedCallback(): void {
        document.removeEventListener('questionChange', this);
    }
}
