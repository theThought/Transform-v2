export function MSliderMarks(args): HTMLElement {
    const container = document.createElement('m-divider-marks');
    const minimum = args.minimum ?? 0;
    const maximum = args.maximum ?? 100;
    const step = args.step ?? 10;

    for (
        let counter: number = minimum;
        counter <= maximum;
        counter = counter + step
    ) {
        const mark = document.createElement('span');
        mark.className = 'a-divider-mark';
        container.appendChild(mark);
    }

    return container;
}

export function MLabelMarks(args): HTMLElement {
    const container = document.createElement('m-label-marks');
    container.style.width = args.width;

    for (
        let counter: number = args.minimum;
        counter <= args.maximum;
        counter = counter + args.step
    ) {
        const label = document.createElement('span');
        label.className = 'a-label-mark';
        label.textContent = counter.toString();
        container.appendChild(label);
    }

    return container;
}
