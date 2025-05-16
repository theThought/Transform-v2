import * as MScaleContainer from '../../Molecules/scale/scale-container';
import * as MLabel from '../../Molecules/Label/prepost';
import { ASingleline } from '../../Atoms/Inputs/Input';

export function OScale_Story(args): HTMLElement {
    const container: HTMLElement = document.createElement('o-scale');
    const prepostLabel = MLabel.MLabelPrePost();
    const scaleContainer = MScaleContainer.MScaleContainer_Story(args);

    container.setAttribute('data-properties', JSON.stringify(args.properties));
    container.style.width = args.width;

    // Clone args and modify the clone
    const clonedArgs = { ...args };
    clonedArgs.align = 'Left';
    clonedArgs.type = 'number';
    clonedArgs.hidden = true;

    const input = ASingleline(clonedArgs);

    container.appendChild(prepostLabel);
    container.appendChild(scaleContainer);
    container.appendChild(input);

    return container;
}
