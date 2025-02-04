import {
    htmlFragmentCustomProperties,
    htmlFragmentMessageError,
} from '../../_htmlFragments';

export const ExampleHtml = (args) => `
${htmlFragmentCustomProperties}

<o-question-container>
    ${htmlFragmentMessageError}

    <o-question>
        <div>QUESTION GOES HERE...</div>

        <o-question-response
            data-customprops='{
                "custompropname":"${args.ExampleCustomProp}"
            }'
        >
            <div>FORM CONTROL(S) GO HERE...</div>
        </o-question-response>
    </o-question>

    <div class="m-message-information">
        <div>
            <ul>
                <li>This is a simple example to demonstrate the structure of a question... <b>HTML markup still TBC</b>.</li>
                <li>It also demonstrates how the custom properties can be modified via Storybook controls, enabling ZeroHeight users to generate the JSON they need when building survey scripts.</li>
                <li>Edit the "<code>ExampleCustomProp</code>" text string, then click the "<code>Generate &amp; copy JSON</code>" button above.</li>
            </ul>
        </div>
    </div>
</o-question-container>
`;
