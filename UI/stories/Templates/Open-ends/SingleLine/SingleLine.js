import {
    htmlFragmentCustomProperties,
    htmlFragmentMessageError,
    htmlFragmentMessageInformation,
} from '../../../_htmlFragments';

export const SingleLineCustomPropertiesHtml = (args) => `
${htmlFragmentCustomProperties}

<o-question-container>
    ${htmlFragmentMessageError}

    <o-question>
        <div>This is a singleline question with custom properties (e.g. number/date input, pre/post labels)</div>

        <o-response
            data-question-id="_Q0"
            data-question-group="_QText"
        >
            <m-input-singleline
                data-question-id="_Q0"
                data-question-group="_QText"
                data-properties='{
                    "labels":{
                        "pre":"${args.PreLabel}",
                        "post":"${args.PostLabel}"
                    }
                }'
            >
                <span class="a-label-pre"></span>
                <input
                    type="text"
                    id="_Q0"
                    class="a-input-singleline"
                />
                <span class="a-label-post"></span>
            </m-input-singleline>
        </o-response>
    </o-question>

    ${htmlFragmentMessageInformation}
</o-question-container>
`;

export const SingleLineSpecialCodesHtml = () => `
<o-question-container>
    ${htmlFragmentMessageError}

    <o-question>
        <div>This is a singleline question with special codes</div>

        <o-response
            data-question-id="_Q0"
            data-question-group="_QText"
        >
            <m-input-singleline
                data-question-id="_Q0"
                data-question-group="_QText"
            >
                <input
                    type="text"
                    id="_Q0"
                    class="a-input-singleline"
                />
            </m-input-singleline>

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
        </o-response>
    </o-question>

    ${htmlFragmentMessageInformation}
</o-question-container>
`;
