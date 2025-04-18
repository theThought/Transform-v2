export const OptionSingleHtml = (): string => `
<m-option-base class="m-option-single-answer">
    <input type="radio" id="radio1" name="radios" />
    <label for="radio1">
        <span class="a-icon-multistate" data-icon-type="single"></span>
        <span class="a-label-option">
            Radio label
        </span>
    </label>
</m-option-base>
`;

export const OptionMultiHtml = (): string => `
<m-option-base class="m-option-multi-answer">
    <input type="checkbox" id="check1" />
    <label for="check1">
        <span class="a-icon-multistate" data-icon-type="multi"></span>
        <span class="a-label-option">
            Checkbox label
        </span>
    </label>
</m-option-base>
`;
