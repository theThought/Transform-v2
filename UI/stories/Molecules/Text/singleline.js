export const SinglelineHtml = (args) => `
<m-singleline
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
</m-singleline>
`;

export const SinglelineNumberHtml = (args) => `
<m-singleline-number
    data-question-id="_Q1"
    data-question-group="_QText"
    data-properties='{
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        },
        "min": "${args.min}",
        "max": "${args.max}",
        "step": "${args.step}"
    }'
>
    <span class="a-label-pre"></span>
    <input
        type="number"
        id="_Q1"
        class="a-singleline"
    />
    <span class="a-label-post"></span>
</m-singleline-number>
`;

export const SinglelineDateHtml = (args) => `
<m-singleline-date
    data-question-id="_Q2"
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
        id="_Q2"
        class="a-singleline"
    />
    <span class="a-label-post"></span>
</m-singleline-date>
`;
