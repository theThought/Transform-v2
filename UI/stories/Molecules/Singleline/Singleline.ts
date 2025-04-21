import MSingleLine from "../../../src/javascript/web-components/m-singleline";
import { ASingleline } from "../../Atoms/Inputs/Input";


export function MSingleLine_Story(args: any): HTMLDivElement {
    const container: MSingleLine = document.createElement('m-singleline');
    const control: HTMLInputElement = ASingleline(args);
    const preLabel: HTMLSpanElement = document.createElement('span');
    const postLabel: HTMLSpanElement = document.createElement('span');

    preLabel.textContent = args.preLabel;
    postLabel.textContent = args.postLabel;

    container.appendChild(preLabel);
    container.appendChild(control);
    container.appendChild(postLabel);

    return container;
}

/**

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
 */