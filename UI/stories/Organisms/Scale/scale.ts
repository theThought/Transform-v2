import OScale from "../../../src/javascript/web-components/o-scale";
import * as MScaleContainer from "../../Molecules/scale/scale-container";
import * as MLabel from "../../Molecules/Label/prepost";
import { ASingleline } from "../../Atoms/Inputs/Input";

export function OScale_Story(args: any): HTMLElement {
    const container: OScale = document.createElement('o-scale');
    const prepostlabel = MLabel.MLabelPrePost(args.prelabel, args.postlabel);
    const scaleContainer = MScaleContainer.MScaleContainer_Story(args);

    args.align = 'Left';
    args.type = 'number';
    args.hidden = true;
    const rangeInput = ASingleline(args);
    
    container.appendChild(prepostlabel);
    container.appendChild(scaleContainer);
    container.appendChild(rangeInput);

    return container;
}