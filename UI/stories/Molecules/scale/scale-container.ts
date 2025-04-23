import MScaleContainer from "../../../src/javascript/web-components/m-scale-container";
import AScaleUnit from "../../../src/javascript/web-components/a-scale-unit";
import { ASingleline } from "../../Atoms/Inputs/Input";

export function MScaleContainer_Story(args: any): HTMLElement {
    
    const container: MScaleContainer = document.createElement('m-scale-container');
    const rangeInput = ASingleline(args);
    for (let counter: number = args.minimum; counter <= args.maximum; counter++) {
        const scaleUnit: AScaleUnit = document.createElement('a-scale-unit') as AScaleUnit;
        scaleUnit.dataValue = counter.toString(); // Set dataValue as string
        container.appendChild(scaleUnit);

        args.align = 'Left';
        args.type = 'range';
        args.hidden = true;
        
        container.setAttribute(
            'style',
            `width: ${args.width};`
        );
    }
    container.appendChild(rangeInput);
    return container;
}