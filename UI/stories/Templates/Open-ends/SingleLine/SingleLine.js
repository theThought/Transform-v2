import {
    htmlFragmentCustomProperties,
    htmlFragmentMessageError,
    htmlFragmentMessageInformation,
} from '../../../_htmlFragments';

export const SingleLineCustomPropertiesHtml = (args) => `
${htmlFragmentCustomProperties}

<main class="surroundcontent">

        <div class="l-question l-stack">
            <div class="l-cover"><!-- cover --></div>

            ${htmlFragmentMessageError}

            <div class="l-row">
                <div class="l-column">
                    <div>This is a singleline question with custom properties (e.g. pre/post labels)</div>
                </div>

                <div class="l-column">
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
                </div>
            </div>

            ${htmlFragmentMessageInformation}
        </div>

</main>
`;

export const SingleLineSpecialCodesHtml = () => `
<main class="surroundcontent">

        <div class="l-question l-stack">
            <div class="l-cover"><!-- cover --></div>

            ${htmlFragmentMessageError}

            <div class="l-row">
                <div class="l-column">
                    <div>This is a singleline question with special codes</div>
                </div>

                <div class="l-column">
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

                        <o-option-sublist>
                            <fieldset aria-describedby="question-id">
                                <m-option-base class="m-option-single-answer" data-exclusive="true">
                                    <input type="radio" id="radio1" name="radios" />
                                    <label for="radio1">
                                        <span class="a-icon-multistate" data-icon-type="single"></span>
                                        <span class="a-label-option">
                                            Special code 1
                                        </span>
                                    </label>
                                </m-option-base>
                                <m-option-base class="m-option-single-answer" data-exclusive="true">
                                    <input type="radio" id="radio2" name="radios" />
                                    <label for="radio2">
                                        <span class="a-icon-multistate" data-icon-type="single"></span>
                                        <span class="a-label-option">
                                            Special code 2
                                        </span>
                                    </label>
                                </m-option-base>
                            </fieldset>
                        </o-option-sublist>
                    </o-response>
                </div>
            </div>

            ${htmlFragmentMessageInformation}
        </div>

</main>
`;
