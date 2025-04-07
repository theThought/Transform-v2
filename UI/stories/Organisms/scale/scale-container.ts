
import { title } from 'process';
import MScaleUnit from '../../Molecules/scale/scale-unit.stories';

const meta: Meta = {
    title: 'Organisms/Scale/ScaleContainer',
    component: 'o-scale-container',
    subcomponents:{ MScaleUnit: 'm-scale-unit'},
    tags: ['autodocs'],
}
export const ScaleContainerHtml = (): render => html `
<o-scale-container>
    <m-scale-unit data-value="1" />
    <m-scale-unit data-value="2" />
    <m-scale-unit data-value="3" />
</o-scale-container>
`;