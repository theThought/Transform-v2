import { ASingleline } from '../../Atoms/Inputs/Input';
import * as ALabel from '../../Atoms/Label/Label';

export function MSingleLine_Story(args: any): HTMLElement {
    const container: HTMLElement = document.createElement('m-singleline');
    container.setAttribute('data-properties', JSON.stringify(args.properties));
    const control: HTMLInputElement = ASingleline(args);
    const preLabel = ALabel.ALabelPre(args.prelabel);
    const postLabel = ALabel.ALabelPost(args.postlabel);

    container.appendChild(preLabel);
    container.appendChild(control);
    container.appendChild(postLabel);

    return container;
}

export function MSingleLineNumber_Story(args: any): HTMLElement {
    const container: HTMLElement = document.createElement(
        'm-singleline-number',
    );
    container.setAttribute('data-properties', JSON.stringify(args.properties));
    const control: HTMLInputElement = ASingleline(args);
    const preLabel = ALabel.ALabelPre(args.prelabel);
    const postLabel = ALabel.ALabelPost(args.postlabel);

    container.appendChild(preLabel);
    container.appendChild(control);
    container.appendChild(postLabel);

    return container;
}

export function MSingleLineDate_Story(args: any): HTMLElement {
    const container: HTMLElement = document.createElement('m-singleline-date');
    container.setAttribute('data-properties', JSON.stringify(args.properties));
    const control: HTMLInputElement = ASingleline(args);
    const preLabel = ALabel.ALabelPre(args.prelabel);
    const postLabel = ALabel.ALabelPost(args.postlabel);

    container.appendChild(preLabel);
    container.appendChild(control);
    container.appendChild(postLabel);

    return container;
}
