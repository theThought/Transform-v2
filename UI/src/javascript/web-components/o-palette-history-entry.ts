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
            }
            .l-col-history {
                display: flex;
            }
            .a-button-icon {
                width: 36px;
                height: 33px;
            }
            .a-button-icon.delete {
                background-color: transparent;
                background-image: url('./build/static/images/delete.svg');
                background-position: center;
                background-repeat: no-repeat;
            }

            .a-button-icon.edit {
                background-color: transparent;
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

    public connectedCallback(): void {
        this.render();
        this.configureEditButton();
        this.configureDeleteButton();
    }
}
