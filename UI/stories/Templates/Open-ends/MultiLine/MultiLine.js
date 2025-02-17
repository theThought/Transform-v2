import {
    htmlFragmentMessageError,
    htmlFragmentMessageInformation,
} from '../../../_htmlFragments';

export const MultiLineHtml = () => `
<o-question-container>
    ${htmlFragmentMessageError}

    <o-question>
        <div>This is a multiline question with special codes</div>

        <o-question-response
            data-questionid="_Q0"
            data-questiongroup="_QText"
        >
            <textarea id="_Q0" class="a-input-multilineedit"></textarea>

            <fieldset
                class="o-option-sublist"
                aria-describedby="question-id"
            >
                <div class="m-option-base m-option-single-answer">
                    <input type="radio" id="radio1" name="radios" />
                    <label for="radio1">
                        <span class="a-icon-multistate" data-icontype="single"></span>
                        <span class="a-label-option">
                            Special code 1
                        </span>
                    </label>
                </div>
                <div class="m-option-base m-option-single-answer">
                    <input type="radio" id="radio2" name="radios" />
                    <label for="radio2">
                        <span class="a-icon-multistate" data-icontype="single"></span>
                        <span class="a-label-option">
                            Special code 2
                        </span>
                    </label>
                </div>
            </fieldset>
        </o-question-response>
    </o-question>

    ${htmlFragmentMessageInformation}
</o-question-container>
`;
