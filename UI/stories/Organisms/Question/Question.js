import {
    htmlFragmentMessageError,
    htmlFragmentMessageInformation,
} from '../../_htmlFragments';

export const OQuestionHtml = () => `
<o-question class="l-stack">
    <div class="l-cover"><!-- cover --></div>

    ${htmlFragmentMessageError}

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

    ${htmlFragmentMessageInformation}

</o-question>
`;
