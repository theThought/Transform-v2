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