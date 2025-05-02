// input.ts
export function ASingleline(args: any): HTMLInputElement {
    var setWidth = args.width || '15em';
    var setAlign = args.align || 'Left';
    const container: HTMLInputElement = document.createElement('input');

    console.log("type:", args.type);
    switch (args.type) {
        case 'text':
            container.setAttribute('type', 'text');
            container.classList.add('a-singleline');
            
            if (args.maximum) {
                container.setAttribute('maxlength', args.maximum.toString());
            }
            break;
        case 'number':
            container.setAttribute('type', 'number');
            container.classList.add('a-singleline-number');
            if (args.minimum) {
                container.setAttribute('min', args.minimum.toString());
            }
            if (args.maximum) {
                container.setAttribute('max', args.maximum.toString());
            }
            container.setAttribute('step', '1');
            break;
        case 'date':
            container.setAttribute('type', 'date');
            container.classList.add('a-singleline-date');

            const formatISODate = (date: number): string => {
                const parsedDate = new Date(date);
                return parsedDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
            };

            if (args.minimum) {
                container.setAttribute('min', formatISODate(args.minimum));
            }
            if (args.maximum) {
                container.setAttribute('max', formatISODate(args.maximum));
            }
            console.log("Min:", container.getAttribute('min'));
            console.log("Max:", container.getAttribute('max'));
            break;
        case 'range':
            container.setAttribute('type', 'range');
            container.classList.add('a-singleine-range');
            if (args.minimum) {
                container.setAttribute('min', args.minimum.toString());
            }
            if (args.maximum) {
                container.setAttribute('max', args.maximum.toString());
            }
            break;
        default:
            console.warn("Unsupported type:", args.type);
    }

    // Apply the width and alignment styles
    container.setAttribute(
        'style',
        `width: ${setWidth}; text-align: ${setAlign.toLowerCase()};`
    );

    if (args.hidden) {
        container.setAttribute('hidden', 'true');
    }
    
    return container;
}

export function AMultiline(args: any): HTMLTextAreaElement {
    const container: HTMLTextAreaElement = document.createElement('textarea');
    container.classList.add('a-multiline');
    return container;
}
