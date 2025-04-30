/**
 * Parent class for all input methods
 *
 * Contains shared functionality that is inherited and common to all our
 * custom components. If you've written the same method twice ask whether
 * it belongs in this class instead of an individual component!
 */
import OResponse from './o-response';

export default class Component extends HTMLElement {
    protected readonly qid: string | undefined;
    protected readonly qgroup: string | undefined;
    protected readonly response: OResponse | null;
    protected properties: Record<string, unknown>;

    constructor() {
        super();

        this.qid = this.dataset.questionId;
        this.qgroup = this.dataset.questionGroup;
        if (this.parentElement) {
            this.response = this.parentElement.closest('o-response');
        } else {
            this.response = null;
        }
        this.properties = {};
    }

    protected parseProperties(): void {
        const properties = this.dataset.properties ?? '{}';
        const propertiesAsJson: Record<string, unknown> = JSON.parse(
            properties.toString(),
        );

        if (this.response) {
            Object.assign(
                this.properties,
                this.response.properties,
                propertiesAsJson,
            );
        } else {
            this.properties = propertiesAsJson;
        }
    }

    protected broadcastChange(): void {
        const broadcastChange = new CustomEvent('broadcastChange', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(broadcastChange);
    }

    public connectedCallback(): void {
        this.parseProperties();
    }
}
