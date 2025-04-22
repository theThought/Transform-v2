import OScale from "../../../src/javascript/web-components/o-scale";
import * as MScaleContainer from "../../Molecules/scale/scale-container";
import * as ALabel from "../../Atoms/Label/Label";

export function OScale_Story(args: any): HTMLElement {
    const container: OScale = document.createElement('o-scale');
    const preLabel = ALabel.ALabelPre(args.prelabel);
    const postLabel = ALabel.ALabelPost(args.postlabel);
    const scaleContainer = MScaleContainer.MScaleContainer_Story(args);
    container.appendChild(preLabel);
    container.appendChild(scaleContainer);
    container.appendChild(postLabel);

    return container;
}