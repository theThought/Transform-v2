/**
 * Parent class for all input methods
 *
 * Contains shared functionality that is inherited and common to all our
 * custom components. If you've written the same method twice ask whether
 * it belongs in this class instead of an individual component!
 */
import OResponse from './o-response';
import { mergeDeep } from './util';

export default class Component extends HTMLElement {
    protected readonly qid: string | undefined;
    protected readonly qgroup: string | undefined;
    protected response: OResponse | null = null;
    protected properties: object;

    constructor() {
        super();

        this.qid = this.dataset.questionId;
        this.qgroup = this.extractQuestionNameFromGroup();
        this.properties = {};
    }

    private extractQuestionNameFromGroup(): string {
        let group = this.dataset.questionGroup ?? '';
        group = group.toLowerCase();
        const groupArray = group.split('_q');
        return groupArray[groupArray.length - 1];
    }

    protected parseProperties(): void {
        let properties = this.dataset.properties ?? '{}';
        properties = properties.replace(/&apos;/g, "'");

        const propertiesAsJson: Record<
            string,
            string | number | boolean | object
        > = JSON.parse(properties.toString());

        if (this.response) {
            this.properties = mergeDeep(
                this.properties,
                this.response.properties,
                propertiesAsJson,
            );
        } else {
            this.properties = mergeDeep(this.properties, propertiesAsJson);
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
        if (this.parentElement) {
            this.response = this.parentElement.closest('o-response');
        } else {
            this.response = null;
        }

        this.parseProperties();
    }
}
