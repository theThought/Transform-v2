export const ScaleUnitHtml = (args): HTMLElement => {
    const elementScaleUnit = document.createElement('m-scale-unit');
    elementScaleUnit.setAttribute('data-value', args.dataValue);
    elementScaleUnit.setAttribute('class', 'a-scale-unit');
    return elementScaleUnit;
}

