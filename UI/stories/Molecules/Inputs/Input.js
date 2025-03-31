export const MSinglelineHtml = (args) => `
<m-input-singleline
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
        type="text"
        id="_Q0"
        class="a-singleline"
    />
    <span class="a-label-post"></span>
</m-input-singleline>
`;

export const MSinglelineNumberHtml = (args) => `
<m-singleline-number
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
        class="a-singleline"
        min="1"
        max="9999"
        step="1"
    />
    <span class="a-label-post"></span>
</m-singleline-number>
`;

export const MSinglelineDateHtml = (args) => `
<m-singleline-date
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
        class="a-singleline"
    />
    <span class="a-label-post"></span>
</m-singleline-date>
`;
