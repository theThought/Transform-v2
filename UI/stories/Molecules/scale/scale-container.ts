import AScaleUnit from '../../../src/javascript/web-components/a-scale-unit';

export function MScaleContainer_Story(args): HTMLElement {
    const container: HTMLElement = document.createElement('m-scale-container');
    container.style.width = args.width;

    for (
        let counter: number = args.minimum;
        counter <= args.maximum;
        counter++
    ) {
        const scaleUnit: AScaleUnit = document.createElement(
            'a-scale-unit',
        ) as AScaleUnit;
        scaleUnit.dataValue = counter.toString(); // Set dataValue as string
        container.appendChild(scaleUnit);

        container.classList.add(`orientation-${args.orientation}`);
    }

    return container;
}
