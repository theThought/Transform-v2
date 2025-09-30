export function AScaleUnit_Story(args: any): HTMLElement {
    const container: HTMLElement = document.createElement('a-scale-unit');
    container.setAttribute('data-value', args.dataValue);
    container.textContent = args.dataValue;
    return container;
}
