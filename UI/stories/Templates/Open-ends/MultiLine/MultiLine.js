import {
    htmlFragmentMessageError,
    htmlFragmentMessageInformation,
} from '../../../_htmlFragments';

export const MultiLineHtml = () => `
<main class="surroundcontent">

        <div class="l-question l-stack">
            <div class="l-cover"><!-- cover --></div>

            ${htmlFragmentMessageError}

            <div class="l-row">
                <div class="l-column">
                    <div>This is a multiline question with special codes</div>
                </div>

                <div class="l-column">
                    <o-response
                        data-question-id="_Q0"
                        data-question-group="_QText"
                    >
                        <textarea id="_Q0" class="a-input-multilineedit"></textarea>

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
                    </o--response>
                </div>
            </div>


            ${htmlFragmentMessageInformation}
        </div>

</main>
`;
