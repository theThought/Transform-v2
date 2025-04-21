// input.ts
export function ASingleline(args: any): HTMLInputElement {
    const container: HTMLInputElement = document.createElement('input');


    console.log("ASingleline args:", args); // Log the args object for debugging

    switch (args.type) {
        case 'text':
            container.setAttribute('type', 'text');
            container.classList.add('a-singleine');
            if (args.maximum) {
                container.setAttribute('maxlength', args.maximum.toString());
            }
            break;
        case 'number':
            container.setAttribute('type', 'number');
            container.classList.add('a-singleine-number');
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
            container.classList.add('a-singleine-date');
            if (args.minimum) {
                container.setAttribute('min', args.minimum);
            }
            if (args.maximum) {
                container.setAttribute('max', args.maximum);
            }
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

    console.log("Generated input element:", container); // Log the generated element for debugging
    return container;
}

export function AMultline(args: any): HTMLTextAreaElement {
    const container: HTMLTextAreaElement = document.createElement('textarea');
    container.classList.add('a-multiline');
    return container;
}
