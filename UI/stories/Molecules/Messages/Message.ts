export const MessageErrorHtml = (): string => `
<div class="m-message-error">
    <div>
        Error message(s).
        <br>
        ARIA <code>role="alert"</code>
        <br><br>
        TODO: Can these contain HTML markup and/or more than 1 line of text?
    </div>
</div>
`;

export const MessageWarningHtml = (): string => `
<div class="m-message-warning">
    <div>
        Warning message(s).
        <br>
        ARIA <code>role="status"</code>
        <br><br>
        TODO: Can these contain HTML markup and/or more than 1 line of text?
    </div>
</div>
`;

export const MessageSuccessHtml = (): string => `
<div class="m-message-success">
    <div>
        Success message(s).
        <br>
        ARIA <code>role="status"</code>
        <br><br>
        TODO: Can these contain HTML markup and/or more than 1 line of text?
    </div>
</div>
`;

export const MessageInformationHtml = (): string => `
<div class="m-message-information">
    <div>
        Information message(s).
        <br><br>
        TODO: Can these contain HTML markup and/or more than 1 line of text?
    </div>
</div>
`;
