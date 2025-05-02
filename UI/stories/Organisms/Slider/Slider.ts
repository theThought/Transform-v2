import * as MLabel from '../../Molecules/Label/prepost';

export function OSlider(args): HTMLElement {
    const container: HTMLElement = document.createElement('o-slider');
    const prepostLabel = MLabel.MLabelPrePost(args.prelabel, args.postlabel);

    container.appendChild(prepostLabel);
    return container;
}
