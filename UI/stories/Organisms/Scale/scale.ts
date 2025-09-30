import * as MScaleContainer from '../../Molecules/scale/scale-container';
import * as MLabel from '../../Molecules/Label/prepost';
import { ASingleline } from '../../Atoms/Input/Input';

export function OScale_Story(args): HTMLElement {
    const container: HTMLElement = document.createElement('o-scale');
    container.setAttribute('data-properties', JSON.stringify(args.properties));
    container.style.width = args.width;

    args.width = ''; // we do not want to pass the width to the molecule as it will compound
    const prepostLabel = MLabel.MLabelPrePost();
    const scaleContainer = MScaleContainer.MScaleContainer_Story(args);

    // Clone args and modify the clone
    const clonedArgs = { ...args };
    clonedArgs.type = 'number';
    clonedArgs.hidden = true;

    const input = ASingleline(clonedArgs);
    input.setAttribute('value', args.value ?? '');

    container.appendChild(prepostLabel);
    container.appendChild(scaleContainer);
    container.appendChild(input);

    return container;
}
