/**
 * Parent class for all input methods
 *
 * Contains shared functionality that is inherited and common to all our
 * custom components. If you've written the same method twice ask whether
 * it belongs in this class instead of an individual component!
 */

export default class Component extends HTMLElement {
    protected qid: string | undefined;
    protected qgroup: string | undefined;
    protected properties: Record<string, unknown>;
    protected question: HTMLElement | null;

    constructor() {
        super();

        this.qid = this.dataset.questionId;
        this.qgroup = this.dataset.questionGroup;
        this.question = this.closest('o-question');
        this.properties = {};

        this.parseProperties();
    }

    private parseProperties(): void {
        const properties = this.dataset.properties;

        if (!properties) {
            return;
        }

        this.properties = JSON.parse(properties.toString());
    }
}
