import OScale from "../../../src/javascript/web-components/o-scale";
import * as MScaleContainer from "../../Molecules/scale/scale-container";
import * as ALabel from "../../Atoms/Label/Label";
import { ASingleline } from "../../Atoms/Inputs/Input";

export function OScale_Story(args: any): HTMLElement {
    const container: OScale = document.createElement('o-scale');
    const preLabel = ALabel.ALabelPre(args.prelabel);
    const postLabel = ALabel.ALabelPost(args.postlabel);
    const scaleContainer = MScaleContainer.MScaleContainer_Story(args);
    args.type = 'range';
    args.align = 'Left';
    args.hidden = true;

    args.align = 'Left';
    args.type = 'number';
    args.hidden = true;
    const rangeInput = ASingleline(args);
    
    container.appendChild(preLabel);
    container.appendChild(scaleContainer);
    container.appendChild(rangeInput);
    container.appendChild(postLabel);

    return container;
}