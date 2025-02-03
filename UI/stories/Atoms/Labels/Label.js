export const LabelQuestionUsingLabelHtml = () => `
<label for="q-text" id="q-label" class="a-label-question">
    Question text - using a <code>&lt;label&gt;</code> - with additional <code>id</code> for use with <code>ARIA</code>.
</label>
`;

export const LabelQuestionUsingDivHtml = () => `
<div id="q-label" class="a-label-question">
    Question text - using a <code>&lt;div&gt;</code> - with additional <code>id</code> for use with <code>ARIA</code>.
</div>
`;

export const LabelOptionHtml = () => `
<span class="a-label-option">
    Checkbox/radio label
</span>
`;

export const LabelHeadingSublistHtml = () => `
<span class="a-label-heading-sublist">
    Sublist heading
</span>
`;
