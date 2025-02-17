export const SublistHtml = () => `
<fieldset
    class="o-option-sublist"
    aria-describedby="question-id"
>
    <legend class="a-label-heading-sublist">
        Sublist heading is a <code>&lt;legend&gt;</code>
    </legend>
    <div class="m-option-base m-option-single-answer">
        <input type="radio" id="radio1" name="radios" />
        <label for="radio1">
            <span class="a-icon-multistate" data-icontype="single"></span>
            <span class="a-label-option">
                Radio 1 label
            </span>
        </label>
    </div>
    <div class="m-option-base m-option-single-answer">
        <input type="radio" id="radio2" name="radios" />
        <label for="radio2">
            <span class="a-icon-multistate" data-icontype="single"></span>
            <span class="a-label-option">
                Radio 2 label
            </span>
        </label>
    </div>
    <div class="m-option-base m-option-single-answer">
        <input type="radio" id="radio3" name="radios" />
        <label for="radio3">
            <span class="a-icon-multistate" data-icontype="single"></span>
            <span class="a-label-option">
                Radio 3 label
            </span>
        </label>
    </div>
</fieldset>
`;
