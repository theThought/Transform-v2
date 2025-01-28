export const OptionSingleHtml = () => `
<div class="m-option-base m-option-single-answer">
    <input type="radio" class="visually-hidden" id="radio1" name="radios" />
    <label for="radio1">
        <span class="a-icon-multistate" data-icontype="single"></span>
        <span class="a-label-option">
            Radio label
        </span>
    </label>
</div>
`;

export const OptionMultiHtml = () => `
<div class="m-option-base m-option-multi-answer">
    <input type="checkbox" class="visually-hidden" id="check1" />
    <label for="check1">
        <span class="a-icon-multistate" data-icontype="multi"></span>
        <span class="a-label-option">
            Checkbox label
        </span>
    </label>
</div>
`;

export const OptionWrapperHtml = () => `
<div class="m-option-wrapper">
    <div class="m-option-base m-option-single-answer">
        <input type="radio" class="visually-hidden" id="radio1" name="radios" />
        <label for="radio1">
            <span class="a-icon-multistate" data-icontype="single"></span>
            <span class="a-label-option">
                Radio 1 label
            </span>
        </label>
    </div>
    <div class="m-option-base m-option-single-answer">
        <input type="radio" class="visually-hidden" id="radio2" name="radios" />
        <label for="radio2">
            <span class="a-icon-multistate" data-icontype="single"></span>
            <span class="a-label-option">
                Radio 2 label
            </span>
        </label>
    </div>
    <div class="m-option-base m-option-multi-answer">
        <input type="checkbox" class="visually-hidden" id="check1" />
        <label for="check1">
            <span class="a-icon-multistate" data-icontype="multi"></span>
            <span class="a-label-option">
                Checkbox 1 label
            </span>
        </label>
    </div>
    <div class="m-option-base m-option-multi-answer">
        <input type="checkbox" class="visually-hidden" id="check2" />
        <label for="check2">
            <span class="a-icon-multistate" data-icontype="multi"></span>
            <span class="a-label-option">
                Checkbox 2 label
            </span>
        </label>
    </div>
</div>
`;
