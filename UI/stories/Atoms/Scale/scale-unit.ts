import AScaleUnit from "../../../src/javascript/web-components/a-scale-unit";

export function AScaleUnit_Story(args: any): HTMLElement {
    const container: AScaleUnit = document.createElement('a-scale-unit');
    container.setAttribute('data-value', args.dataValue);
    container.textContent = args.dataValue;
    return container;
}