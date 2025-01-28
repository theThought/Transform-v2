import {
    htmlFragmentCustomProperties
} from '../../_htmlFragments';

export const ExampleHtml = (args) => `
${htmlFragmentCustomProperties}

<o-question-response
    data-customprops='{
        "example":"${args.ExampleCustomProp}"
    }'
>
    <p>This is a simple example to demonstrate how the custom properties JSON can be modified via Storybook controls, enabling ZeroHeight users to generate the JSON they need when building survey scripts.</p>
</o-question-response>
`;
