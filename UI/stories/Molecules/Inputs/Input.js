export const MInputSinglelineHtml = (args) => `
<m-input-singleline
    data-question-id="_Q0"
    data-question-group="_QText"
    ='{
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        }
    }'
>
    <span class="a-label-pre"></span>
    <input
        type="text"
        id="_Q0"
        class="a-input-singleline"
    />
    <span class="a-label-post"></span>
</m-input-singleline>
`;

export const MInputSinglelineNumberHtml = (args) => `
<m-input-singleline-number
    data-question-id="_Q0"
    data-question-group="_QText"
    data-properties='{
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        }
    }'
>
    <span class="a-label-pre"></span>
    <input
        type="number"
        id="_Q0"
        class="a-input-singleline"
        min="1"
        max="9999"
        step="1"
    />
    <span class="a-label-post"></span>
</m-input-singleline-number>
`;

export const MInputSinglelineDateHtml = (args) => `
<m-input-singleline-date
    data-question-id="_Q0"
    data-question-group="_QText"
    data-properties='{
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        }
    }'
>
    <span class="a-label-pre"></span>
    <input
        type="date"
        id="_Q0"
        class="a-input-singleline"
    />
    <span class="a-label-post"></span>
</m-input-singleline-date>
`;
