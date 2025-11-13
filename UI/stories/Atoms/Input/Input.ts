export function ASingleline(args: any): HTMLInputElement {
    const width = args.width ? `width: ${args.width};` : '';
    const alignment = args['text-align']
        ? `text-align: ${args['text-align']};`
        : '';
    const value = args.value ? `${args.value}` : '';
    const component: HTMLInputElement = document.createElement('input');
    component.placeholder = args['placeholder'] ? `${args['placeholder']}` : '';
    component.setAttribute('value', value);

    switch (args.type) {
        case 'text':
            component.setAttribute('type', 'text');
            component.classList.add('a-singleline');
            if (args.maxlength) {
                component.setAttribute('maxlength', args.maxlength.toString());
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
            break;
    }

    // Apply the width and alignment styles
    component.setAttribute('style', `${width} ${alignment}`);

    if (args.hidden) {
        component.setAttribute('hidden', 'true');
    }

    return component;
}

export function AMultiline(args: any): HTMLTextAreaElement {
    const width = args.width ? `width: ${args.width};` : '';
    const alignment = args['text-align']
        ? `text-align: ${args['text-align']};`
        : '';
    const component: HTMLTextAreaElement = document.createElement('textarea');
    component.classList.add('a-multiline');
    component.innerHTML = args.value;

    // Apply the width and alignment styles
    component.setAttribute('style', `${width} ${alignment}`);

    if (args.hidden) {
        component.setAttribute('hidden', 'true');
    }

    return component;
}
