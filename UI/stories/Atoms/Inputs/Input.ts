export function ASingleline(args: any): HTMLInputElement {
    const width = args.width || '15em';
    const alignment = args.align || 'left';
    const component: HTMLInputElement = document.createElement('input');
    component.setAttribute('data-properties', JSON.stringify(args));

    switch (args.type) {
        case 'text':
            component.setAttribute('type', 'text');
            component.classList.add('a-singleline');
            if (args.maximum) {
                component.setAttribute('maxlength', args.maximum.toString());
            }
            break;
        case 'number':
            component.setAttribute('type', 'number');
            component.classList.add('a-singleline-number');
            if (args.minimum) {
                component.setAttribute('min', args.minimum.toString());
            }
            if (args.maximum) {
                component.setAttribute('max', args.maximum.toString());
            }
            if (args.step) {
                component.setAttribute('step', args.step.toString());
            } else {
                component.setAttribute('step', 'any');
            }
            break;
        case 'date':
            component.setAttribute('type', 'date');
            component.classList.add('a-singleline-date');

            const formatISODate = (date: number): string => {
                const parsedDate = new Date(date);
                return parsedDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
            };

            if (args.minimumDate) {
                component.setAttribute('min', formatISODate(args.minimumDate));
            }
            if (args.maximumDate) {
                component.setAttribute('max', formatISODate(args.maximumDate));
            }
            break;
        case 'range':
            component.setAttribute('type', 'range');
            component.classList.add('a-slider-input');
            if (args.minimum) {
                component.setAttribute('min', args.minimum.toString());
            }
            if (args.maximum) {
                component.setAttribute('max', args.maximum.toString());
            }
            if (args.step) {
                component.setAttribute('step', args.step.toString());
            } else {
                component.setAttribute('step', 'any');
            }
            break;
    }

    // Apply the width and alignment styles
    component.setAttribute(
        'style',
        `width: ${width}; text-align: ${alignment};`,
    );

    if (args.hidden) {
        component.setAttribute('hidden', 'true');
    }

    return component;
}

export function AMultiline(args: any): HTMLTextAreaElement {
    const component: HTMLTextAreaElement = document.createElement('textarea');
    component.classList.add('a-multiline');

    // Apply the width and alignment styles
    component.setAttribute(
        'style',
        `width: ${args.width}; text-align: ${args.align};`,
    );

    if (args.hidden) {
        component.setAttribute('hidden', 'true');
    }

    return component;
}
