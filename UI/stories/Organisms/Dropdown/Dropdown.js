export const DropdownHtml = (args) => `
<o-dropdown
    class="o-select-custom"
    data-questionid="_Q0"
    data-questiongroup="_QDropdown"
    data-customprops='{
        "jumptofirstletter":${args.JumpToFirstLetter}
    }'
>
    <input type="text" class="a-input-dropdown" placeholder="placeholder" />
    <ul class="m-list l-stack">
        <li class="a-option-list">I am first option in dropdown or combobox</li>
        <li class="a-option-list">I am an option in dropdown or combobox</li>
        <li class="a-option-list">I am a short option</li>
        <li class="a-option-list">I am a much longer option in dropdown or combobox</li>
        <li class="a-option-list">I am last option in dropdown or combobox</li>
    </ul>
</o-dropdown>

<br /><br />
<p>TODO:</p>
<ul>
    <li>Implement accessibility improvements for screen reader & keyboard users using the appropriate <a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/">ARIA APG pattern</a>.</li>
    <li>Wire up custom properties to the component HTML.</li>
</ul>
`;
