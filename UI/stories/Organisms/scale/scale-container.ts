
import MScaleUnit from '../../Molecules/scale/scale-unit.stories';


import { html } from 'lit';


export const ScaleContainerHtml = (): render => html `
<o-scale-container>
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 1 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 2 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 3 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 4 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 5 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 6 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 7 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 8 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 9 }))
    $(MScaleUnit.ScaleUnitHtml({ dataValue: 10 }))
</o-scale-container>
`;