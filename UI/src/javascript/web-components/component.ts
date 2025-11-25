/**
 * Parent class for all input methods
 *
 * Contains shared functionality that is inherited and common to all our
 * custom components. If you've written the same method: twice ask whether
 * it belongs in this class instead of an individual component!
 */
import OResponse from './o-response';
import { mergeDeep } from './util';

export default class Component extends HTMLElement {
    protected readonly qid: string;
    protected readonly qgroup: string;
    protected response: OResponse | null = null;
    protected properties: object = {};
    protected element:
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null = null;

    constructor() {
        super();

        this.qid = this.dataset.questionId ?? '';
        this.qgroup = this.extractQuestionNameFromGroup();
    }

    private extractQuestionNameFromGroup(): string {
        let group = this.dataset.questionGroup ?? '';
        group = group.toLowerCase();
        const groupArray = group.split('_q');
        return (
            groupArray[groupArray.length - 2] +
            groupArray[groupArray.length - 1]
        );
    }

    protected parseProperties(): void {
        let properties = this.dataset.properties ?? '{}';
        properties = properties.replace(/&apos;/g, "'");
        if (!properties.length) properties = '{}';

        const propertiesAsJson: Record<
            string,
            string | number | boolean | object
        > = JSON.parse(properties.toString());

        if (this.response?.properties) {
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

    protected setElement(): void {
        this.element = this.querySelector('input, select, textarea') ?? null;
    }

    protected configureSetBehaviour(): void {
        if (!this.element) return;
        if (this.element.type === 'checkbox' || this.element.type === 'radio')
            return;

        const { get, set } = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
        );

        Object.defineProperty(this.element, 'value', {
            get() {
                return get.call(this);
            },
            set(newVal) {
                console.log(`New value assigned to ${this.id}: ` + newVal);
                const result = set.call(this, newVal);
                this.dispatchEvent(new Event('restore', { bubbles: true }));
                return result;
            },
        });
    }

    public connectedCallback(): void {
        this.response = this.closest('o-response') ?? null;
        this.parseProperties();
        this.setElement();
        this.configureSetBehaviour();
    }
}
