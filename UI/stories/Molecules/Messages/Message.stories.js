import {
    MessageErrorHtml,
    MessageSuccessHtml,
    MessageWarningHtml,
    MessageInstructionHtml
} from './Message';

export default {
    title: 'Molecules/Messages',
    parameters: {
        status: {
            type: 'beta',
        },
    }
};

export const MessageError = {
    render: () => MessageErrorHtml(),
};
MessageError.storyName = 'm-message-error';

export const MessageSuccess = {
    render: () => MessageSuccessHtml(),
};
MessageSuccess.storyName = 'm-message-success';

export const MessageWarning = {
    render: () => MessageWarningHtml(),
};
MessageWarning.storyName = 'm-message-warning';

export const MessageInstruction = {
    render: () => MessageInstructionHtml(),
};
MessageInstruction.storyName = 'm-message-instruction';
