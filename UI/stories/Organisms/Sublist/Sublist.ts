import { htmlFragmentCustomProperties } from '../../_htmlFragments';

export const SublistHtml = (args): string => `
${htmlFragmentCustomProperties}

<o-option-sublist
    role="group"
    aria-describedby="question-id"
    data-properties='{
        "balance":{
            "state":${args.Balance}
        },
        "onesize":{
            "state":${args.OneSize}
        }
    }'
>
    <legend class="a-label-heading-sublist">
        Sublist heading is a <code>&lt;legend&gt;</code>
    </legend>
    <m-option-base class="m-option-single-answer"
        data-properties='{
            "balance":{
                "minwidth":"${args.MinWidth}"
            }
        }'
    >
        <input type="radio" id="radio1" name="radios" />
        <label for="radio1">
            <span class="a-icon-multistate" data-icon-type="single"></span>
            <span class="a-label-option">
                Radio 1 label
            </span>
        </label>
    </m-option-base>
    <m-option-base class="m-option-single-answer"
        data-properties='{
            "balance":{
                "minwidth":"${args.MinWidth}"
            }
        }'
    >
        <input type="radio" id="radio2" name="radios" />
        <label for="radio2">
            <span class="a-icon-multistate" data-icon-type="single"></span>
            <span class="a-label-option">
                Radio 2 label
            </span>
        </label>
    </m-option-base>
    <m-option-base class="m-option-single-answer"
        data-properties='{
            "balance":{
                "minwidth":"${args.MinWidth}"
            }
        }'
    >
        <input type="radio" id="radio3" name="radios" />
        <label for="radio3">
            <span class="a-icon-multistate" data-icon-type="single"></span>
            <span class="a-label-option">
                Radio 3 label
            </span>
        </label>
    </m-option-base>
</o-option-sublist>
`;
