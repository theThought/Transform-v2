export const MInputSinglelineEditHtml = (args) => `
<!--
    TODO:
    See https://app.clickup.com/t/8697h5cc4?comment=90120097089630&threadedComment=90120097249142
 -->
<o-question-response
    data-questionid="_Q0"
    data-questiongroup="_QText"
    data-customprops='{
        "type":"${args.InputType}",
        "labels":{
            "pre":"${args.PreLabel}",
            "post":"${args.PostLabel}"
        }
    }'
>
    <m-input-singlelineedit
        data-questionid="_Q0"
        data-questiongroup="_QText"
    >
        <input
            type="text"
            id="_Q0"
            class="a-input-singlelineedit"
        />
    </m-input-singlelineedit>
</o-question-response>
`;
