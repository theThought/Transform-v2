import MSingleLine from '../../../src/javascript/web-components/m-singleline';
import { ASingleline } from '../../Atoms/Inputs/Input';
import * as ALabel from '../../Atoms/Label/Label';

export function MSingleLine_Story(args: any): HTMLDivElement {
    const container: MSingleLine = document.createElement('m-singleline');
    const control: HTMLInputElement = ASingleline(args);
    const preLabel = ALabel.ALabelPre(args.prelabel);
    const postLabel = ALabel.ALabelPost(args.postlabel);

    container.appendChild(preLabel);
    container.appendChild(control);
    container.appendChild(postLabel);

    return container;
}
