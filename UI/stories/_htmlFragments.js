/* Display custom properties JSON for ZeroHeight scriptwriter users. */
export const htmlFragmentCustomProperties = `
<div style="margin-block-end: 3rem;">
    <button class="a-button" data-copy>Generate & copy custom properties JSON</button>
    <code style="display: block; margin-block-start: 1rem;">
        <pre data-json style="white-space: pre-wrap;">{}</pre>
    </code>
</div>
`;

/* Keep these HTML fragments in sync with the "real" atomic components. */
export const htmlFragmentMessageError = `
<div class="l-row">
    <div class="l-column">
        <div class="m-message-error">
            <div>
                Error message(s).
            </div>
        </div>
    </div>
</div>
`;

export const htmlFragmentMessageInformation = `
<div class="l-row">
    <div class="l-column">
        <div class="m-message-information">
            <div>
                Information message(s).
            </div>
        </div>
    </div>
</div>
`;
