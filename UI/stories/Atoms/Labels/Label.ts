export const LabelQuestionUsingLabelHtml = (): string => `
<label for="q-text" id="q-label" class="a-label-question">
    Question text - using a <code>&lt;label&gt;</code> - with additional <code>id</code> for use with <code>ARIA</code>.
</label>
`;

export const LabelQuestionUsingDivHtml = (): string => `
<div id="q-label" class="a-label-question">
    Question text - using a <code>&lt;div&gt;</code> - with additional <code>id</code> for use with <code>ARIA</code>.
</div>
`;

export const LabelOptionHtml = (): string => `
<span class="a-label-option">
    Checkbox/radio label
</span>
`;

export const LabelHeadingSublistHtml = (): string => `
<span class="a-label-heading-sublist">
    Sublist heading
</span>
`;

export const LabelPreHtml = (): string => `
<span class="a-label-pre">Pre-label</span>
`;

export const LabelPostHtml = (): string => `
<span class="a-label-post">Post-label</span>
`;


class ALabelPre extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    get content() {
        return this.getAttribute('data-value');
    }

    set content(value) {
        if (!value) {
            value = '';
        }
        this.textContent = value;
    }

    render() {
        this.shadowRoot.textContent = this.content
    }
}

// Export the class
export default ALabelPre; 

