import {
    htmlFragmentCustomProperties,
    htmlFragmentMessageError,
} from '../../_htmlFragments';

export const ExampleHtml = (args): string => `
${htmlFragmentCustomProperties}

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
                <div>QUESTION GOES HERE...</div>
            </div>

            <div class="l-column">
                <o-response>
                    <div
                        data-properties='{
                            "custompropname":"${args.ExampleCustomProp}"
                        }'
                    >
                        FORM CONTROL(S) GO HERE...
                    </div>
                </o-response>
            </div>
        </div>

        <div class="l-row">
            <div class="l-column">
                <div class="m-message-information">
                    <div>
                        <ul>
                            <li>This is a simple example to demonstrate the structure of a question template.</li>
                            <li>It also demonstrates how the custom properties can be modified via Storybook controls, enabling ZeroHeight users to generate the JSON they need when building survey scripts.</li>
                            <li>Edit the "<code>ExampleCustomProp</code>" text string, then click the "<code>Generate &amp; copy JSON</code>" button above.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </o-question>

</main>
`;
