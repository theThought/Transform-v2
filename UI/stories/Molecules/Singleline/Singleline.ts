export const SinglelineHtml = (args): string => `
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

export const SinglelineNumberHtml = (args): string => `
<m-singleline-number
    data-question-id="_Q1"
    data-question-group="_QText"
    data-properties='{
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        },
        "step": "${args.StepInterval}"
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

export const SinglelineDateHtml = (args): string => `
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
