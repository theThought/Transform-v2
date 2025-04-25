import OScale from "../../../src/javascript/web-components/o-scale";
import * as MScaleContainer from "../../Molecules/scale/scale-container";
import * as MLabel from "../../Molecules/Label/prepost";
import { ASingleline } from "../../Atoms/Inputs/Input";

export function OScale_Story(args: any): HTMLElement {
    const container: OScale = document.createElement('o-scale');
    const prepostLabel = MLabel.MLabelPrePost(args.prelabel, args.postlabel);
    const scaleContainer = MScaleContainer.MScaleContainer_Story(args);

    // Clone args and modify the clone
    const clonedArgs = { ...args };
    clonedArgs.align = 'Left';
    clonedArgs.type = 'number';
    clonedArgs.hidden = true;

    const rangeInput = ASingleline(clonedArgs);
    
    container.appendChild(prepostLabel);
    container.appendChild(scaleContainer);
    container.appendChild(rangeInput);

    return container;
}