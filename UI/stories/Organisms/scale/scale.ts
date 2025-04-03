export const ScaleHtml = (args): string => `
<o-scale 
    data-question-id="_Q0"
    data-question-group="_QText"
    data-properties='{
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        }
    }'>
    <div class="m-label-prepost">
        <span class="a-label-pre">${args.PreLabel}</span>
        <span class="a-label-post">${args.PostLabel}</span>
    </div>
    <o-scale-container />
</o-scale>
`;

export const ScaleVerticalHtml = (): string => `
<o-scale-vertical 
    data-question-id="_Q0"
    data-question-group="_QText"
    data-properties='{
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        }
    }'>
    <span class="a-label-post">${args.PostLabel}</span>
    <o-scale-container />
    <span class="a-label-pre">${args.PreLabel}</span>
</o-scale-vertical>
`;