export default class OPaletteHistoryEntry extends HTMLElement {
    private EditButton: HTMLElement | null | undefined = undefined;
    private DeleteButton: HTMLElement | null | undefined = undefined;
    private ResetButton: HTMLElement | null | undefined = undefined;

    constructor() {
        super();

        const template: HTMLTemplateElement | null = document.querySelector(
            '.history-inprogress template',
        );

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
            }`;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    render(): void {
        const innerSlot = this.shadowRoot?.querySelector('.l-col-history-ftd');
        if (!innerSlot) return;
        innerSlot.innerHTML = this.getAttribute('data-value') || '';
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
            console.log('edit');
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
            console.log('delete');
        });
    }

    private configureResetButton(): void {
        this.ResetButton = this.shadowRoot?.querySelector(
            'button.a-button-icon.reset',
        );

        if (!this.ResetButton) {
            console.warn('Reset button not found');
            return;
        }

        this.ResetButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('reset');
        });
    }

    public connectedCallback(): void {
        this.render();
        this.configureEditButton();
        this.configureDeleteButton();
        this.configureResetButton();
    }
}
