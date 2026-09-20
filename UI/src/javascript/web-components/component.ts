/**
 * Parent class for all input methods
 *
 * Contains shared functionality that is inherited and common to all our
 * custom components. If you've written the same method: twice ask whether
 * it belongs in this class instead of an individual component!
 */
import OResponse from './o-response';
import { mergeDeep, type JsonObject } from './util';

export default class Component extends HTMLElement {
    protected readonly qid: string;
    protected static observedAttributes = [
        'readonly',
        'data-readonly',
        'data-autofocus',
    ];

    protected qgroup: string;
    protected response: OResponse | null = null;
    protected properties: JsonObject = {};
    protected isReadonly: boolean = false;
    protected isExclusive = false;
    protected element:
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | HTMLButtonElement
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
        this.properties = this.parsePropertiesFrom(this, this.properties);
    }

    protected parsePropertiesFrom(
        element: HTMLElement,
        baseProperties: JsonObject = {},
    ): JsonObject {
        let properties = element.dataset.properties ?? '{}';
        properties = properties.replace(/&apos;/g, "'");
        if (!properties.length) properties = '{}';

        let propertiesAsJson: JsonObject;
        try {
            propertiesAsJson = JSON.parse(properties.toString());
        } catch {
            // Some older generated pages contain JavaScript-style property
            // strings. Callers that support those pages can apply a fallback.
            return baseProperties;
        }

        if (this.response?.properties) {
            return mergeDeep(
                baseProperties,
                this.response.properties,
                propertiesAsJson,
            );
        }

        return mergeDeep(baseProperties, propertiesAsJson);
    }

    protected broadcastChange(): void {
        const broadcastChange = new CustomEvent('broadcastChange', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(broadcastChange);
    }

    protected setElement(): void {
        this.element =
            this.querySelector('input, select, textarea, button') ?? null;
    }

    protected configureSetBehaviour(): void {
        if (!this.element) return;
        if (
            this.element.type === 'button' ||
            this.element.type === 'submit' ||
            this.element.type === 'checkbox' ||
            this.element.type === 'radio' ||
            this.element.type === 'textarea'
        )
            return;

        const descriptor = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
        );

        const get = descriptor?.get;
        const set = descriptor?.set;

        if (!get || !set) return;

        // A parent response and its child control can both resolve the same
        // input. The first component to connect installs this behaviour; a
        // second definition would fail because defineProperty defaults to
        // configurable: false.
        if (Object.prototype.hasOwnProperty.call(this.element, 'value')) {
            return;
        }

        Object.defineProperty(this.element, 'value', {
            get() {
                return get.call(this);
            },
            set(newVal) {
                set.call(this, newVal);
                if (newVal.length)
                    this.dispatchEvent(new Event('restore', { bubbles: true }));
            },
        });
    }

    public getQuestionGroup(): string {
        return this.qgroup;
    }

    public getExclusive(): boolean {
        return this.isExclusive;
    }

    protected isNonExclusiveOptionSource(e: CustomEvent): boolean {
        const source = e.detail as {
            dataset?: DOMStringMap;
            getExclusive?: () => boolean;
        };

        return (
            typeof source.dataset?.checked !== 'undefined' &&
            source.getExclusive?.() !== true
        );
    }

    protected setQuestionGroup(questionGroup: string): void {
        this.qgroup = questionGroup;
    }

    public attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
    ): void {
        switch (name) {
            case 'readonly':
                this.isReadonly = newValue == 'true';
                this.dataset.readonly = newValue;
                break;
            case 'data-autofocus':
                this.tabIndex = 1;
                this.focus();
                this.removeAttribute('tabindex');
                break;
            case 'data-readonly':
                this.isReadonly = newValue == 'true';
                break;
        }
    }

    protected setExclusive(): void {
        this.isExclusive = this.getAttribute('data-exclusive') === 'true';
    }

    public connectedCallback(): void {
        this.response = this.closest('o-response') ?? null;
        this.parseProperties();
        this.setElement();
        this.configureSetBehaviour();
        this.setExclusive();
    }
}
