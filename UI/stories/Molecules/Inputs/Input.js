export const MInputSinglelineEditHtml = (args) => `
<!--
    TODO:
    1. Confirm custom element name for "<o-question-response>" replacement?
    2. Confirm if "<m-input-singlelineedit>" needs "data-question-" attributes that match container's attributes?
 -->
 <o-question-response
    data-question-id="_Q0"
    data-question-group="_QText"
    data-properties='{
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        }
    }'
>
    <m-input-singlelineedit
        data-question-id="_Q0"
        data-question-group="_QText"
    >
        <span class="a-label-prepost" data-prelabel></span>
        <input
            type="${args.InputType}"
            id="_Q0"
            class="a-input-singlelineedit"
        />
        <span class="a-label-prepost" data-postlabel></span>
    </m-input-singlelineedit>
</o-question-response>
`;
