import {
    MessageErrorHtml,
    MessageWarningHtml,
    MessageSuccessHtml,
    MessageInformationHtml
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

export const MessageWarning = {
    render: () => MessageWarningHtml(),
};
MessageWarning.storyName = 'm-message-warning';

export const MessageSuccess = {
    render: () => MessageSuccessHtml(),
};
MessageSuccess.storyName = 'm-message-success';

export const MessageInformation = {
    render: () => MessageInformationHtml(),
};
MessageInformation.storyName = 'm-message-information';
