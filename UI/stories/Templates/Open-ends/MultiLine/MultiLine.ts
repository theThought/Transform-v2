import {
    htmlFragmentMessageError,
    htmlFragmentMessageInformation,
} from '../../../_htmlFragments';

export const MultiLineHtml = (): string => `
<main class="surroundcontent">

    <o-question>
        <div class="l-cover"><!-- cover --></div>

        <div class="l-row">
            <div class="l-column">
                ${htmlFragmentMessageError}
            </div>
        </div>

        <div class="l-row">
            <div class="l-column">
                <div>This is a multiline question with special codes</div>
            </div>

            <div class="l-column">
                <o-response
                    data-question-id="_Q0"
                    data-question-group="_QText"
                >
                <fieldset>
                    <textarea id="_Q0" class="a-multilineedit"></textarea>

                    <o-option-sublist role="group" aria-describedby="question-id">
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
                    </o-option-sublist>
                    </fieldset>
                </o-response>
            </div>
        </div>

        <div class="l-row">
            <div class="l-column">
                ${htmlFragmentMessageInformation}
            </div>
        </div>

    </o-question>

</main>
`;
