export const SinglelineHtml = (args): string => `
<m-singleline
    data-question-id="_Q0"
    data-question-group="_QText"
    data-properties='{
        "labels":{
        }
    }'
>
${args.PreLabel}
${args.PostLabel}
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
</m-singleline-date>
`;
