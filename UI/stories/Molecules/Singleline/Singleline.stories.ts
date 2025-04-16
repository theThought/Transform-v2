import * as SingleLineStories from './Singleline';
import * as LabelStories from '../../Atoms/Labels/Label.stories';
import { StoryObj } from '@storybook/html';

type Story = StoryObj;

export default {
    title: 'Molecules/Singleline',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        PreLabel: {
            control: 'text',
            description: 'Specifies the text to be placed before the input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        PostLabel: {
            control: 'text',
            description: 'Specifies the text to be placed after the input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
    },
};

export const MSingleline: Story = {
    render: (args) => `
    <m-singleline
    data-question-id="_Q0"
    data-question-group="_QText"
    data-properties='{
        "labels":{
        }
    }'
>
${LabelStories.PreLabel}
</m-singleline>
    `,
};
MSingleline.storyName = 'm-singleline';

export const MSinglelineNumber = {
    argTypes: {
        StepInterval: {
            control: 'text',
            description: 'Specifies the step interval for a number input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'any' },
            },
        },
    },
    args: {
        PreLabel: '',
        PostLabel: '',
        StepInterval: '',
    },
    render: (args) => SingleLineStories.SinglelineNumberHtml(args),
};
MSinglelineNumber.storyName = 'm-singleline-number';

export const MSinglelineDate: Story = {
    args: {
        PreLabel: '',
        PostLabel: '',
    },
    render: (args) => SingleLineStories.SinglelineDateHtml(args),
};
MSinglelineDate.storyName = 'm-singleline-date';
