export const ComboboxHtml = () => `
<o-combobox class="o-select-custom">
    <input type="text" class="a-input-combobox" placeholder="placeholder" />
    <ul class="m-list l-stack">
        <li class="a-option-list">I am first option in dropdown or combobox</li>
        <li class="a-option-list">I am an option in dropdown or combobox</li>
        <li class="a-option-list">I am a short option</li>
        <li class="a-option-list">I am a much longer option in dropdown or combobox</li>
        <li class="a-option-list">I am last option in dropdown or combobox</li>
    </ul>
</o-combobox>

<br /><br />
<p>
    TODO:<br />
    Implement accessibility improvements for screen reader & keyboard users with an appropriate <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/">ARIA APG pattern</a>.
</p>
`;
