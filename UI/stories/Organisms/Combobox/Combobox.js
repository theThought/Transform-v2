export const ComboboxHtml = (args) => `
<o-combobox
    class="o-select-custom"
    data-question-id="_Q0"
    data-question-group="_QCombobox"
    data-customprops='{
        "exact":${args.Exact},
        "filtertype":"${args.FilterType}"
    }'
>
    <input type="text" class="a-input-combobox" placeholder="placeholder" />
    <ul class="m-list">
        <li class="a-option-list">I am first option in dropdown or combobox</li>
        <li class="a-option-list">I am an option in dropdown or combobox</li>
        <li class="a-option-list">I am a short option</li>
        <li class="a-option-list">I am a much longer option in dropdown or combobox</li>
        <li class="a-option-list">I am last option in dropdown or combobox</li>
    </ul>
</o-combobox>

<br /><br />
<p>TODO:</p>
<ul>
    <li>Implement accessibility improvements for screen reader & keyboard users using the appropriate <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/">ARIA APG pattern</a>.</li>
    <li>Wire up custom properties to the component HTML.</li>
</ul>
`;
