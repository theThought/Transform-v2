export const OptionSingleHtml = () => `
<div class="m-option-base m-option-single-answer">
    <input type="radio" id="radio1" name="radios" />
    <label for="radio1">
        <span class="a-icon-multistate"></span>
        <span class="a-label-option">
            Radio label
        </span>
    </label>
</div>
`;

export const OptionMultiHtml = () => `
<div class="m-option-base m-option-multi-answer">
    <input type="checkbox" id="check1" />
    <label for="check1">
        <span class="a-icon-multistate"></span>
        <span class="a-label-option">
            Checkbox label
        </span>
    </label>
</div>
`;

export const OptionWrapperHtml = () => `
<div class="m-option-wrapper">
    <div class="m-option-base m-option-single-answer">
        <input type="radio" id="radio1" name="radios" />
        <label for="radio1">
            <span class="a-icon-multistate"></span>
            <span class="a-label-option">
                Radio 1 label
            </span>
        </label>
    </div>
    <div class="m-option-base m-option-single-answer">
        <input type="radio" id="radio2" name="radios" />
        <label for="radio2">
            <span class="a-icon-multistate"></span>
            <span class="a-label-option">
                Radio 2 label
            </span>
        </label>
    </div>
    <div class="m-option-base m-option-multi-answer">
        <input type="checkbox" id="check1" />
        <label for="check1">
            <span class="a-icon-multistate"></span>
            <span class="a-label-option">
                Checkbox 1 label
            </span>
        </label>
    </div>
    <div class="m-option-base m-option-multi-answer">
        <input type="checkbox" id="check2" />
        <label for="check2">
            <span class="a-icon-multistate"></span>
            <span class="a-label-option">
                Checkbox 2 label
            </span>
        </label>
    </div>
</div>
`;
