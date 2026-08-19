export default class OPaletteHistoryEntry extends HTMLElement {
    private EditButton: HTMLElement | null | undefined = undefined;
    private DeleteButton: HTMLElement | null | undefined = undefined;

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
        this.shadowRoot
            ?.querySelectorAll('ftd[type="variable"]')
            .forEach((ftd) => {
                const associateControl = ftd.getAttribute(
                    'data-associate-control',
                );
                if (!associateControl) return;

                ftd.textContent =
                    this.getAttribute(`data-label-${associateControl}`) ||
                    this.getAttribute(`data-${associateControl}`) ||
                    '';
            });
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
        this.render();
        this.configureEditButton();
        this.configureDeleteButton();
        this.configureSelection();
    }
}
