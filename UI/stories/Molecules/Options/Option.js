export const OptionSingleHtml = () => `
<m-option-base class="m-option-single-answer">
    <input type="radio" id="radio1" name="radios" />
    <label for="radio1">
        <span class="a-icon-multistate" data-icontype="single"></span>
        <span class="a-label-option">
            Radio label
        </span>
    </label>
</m-option-base>
`;

export const OptionMultiHtml = () => `
<m-option-base class="m-option-multi-answer">
    <input type="checkbox" id="check1" />
    <label for="check1">
        <span class="a-icon-multistate" data-icontype="multi"></span>
        <span class="a-label-option">
            Checkbox label
        </span>
    </label>
</m-option-base>
`;
