import {
    htmlFragmentMessageError,
    htmlFragmentMessageInformation,
} from '../../_htmlFragments';

export const OQuestionHtml = (): string => `
<o-question>
    <div class="l-cover"><!-- cover --></div>

    <div class="l-row">
        <div class="l-column">
            ${htmlFragmentMessageError}
        </div>
    </div>

    <div class="l-row">
        <div class="l-column">
            <div>QUESTION GOES HERE...</div>
        </div>

        <div class="l-column">
            <o-response>
                FORM CONTROL(S) GO HERE... e.g.<br>
                <input type="text" />
            </o-response>
        </div>
    </div>

    <div class="l-row">
        <div class="l-column">
            ${htmlFragmentMessageInformation}
        </div>
    </div>

</o-question>
`;
