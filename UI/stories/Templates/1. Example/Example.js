import {
    htmlFragmentCustomProperties
} from '../../_htmlFragments';

export const ExampleHtml = (args) => `
${htmlFragmentCustomProperties}

<o-question-response
    data-customprops='{
        "custompropname":"${args.ExampleCustomProp}"
    }'
>
    <ul>
        <li>This is a simple example to demonstrate how the custom properties JSON can be modified via Storybook controls.</li>
        <li>It enables ZeroHeight users to generate the JSON they need when building survey scripts.</li>
        <li>Edit the "<code>ExampleCustomProp</code>" text string, then click the "<code>Generate &amp; copy JSON</code>" button above.</li>
    </ul>
</o-question-response>
`;
