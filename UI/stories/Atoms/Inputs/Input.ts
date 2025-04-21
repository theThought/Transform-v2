// input.ts
export function ASingleline(args:any): HTMLInputElement {
    const container: HTMLInputElement = document.createElement('input');
    container.setAttribute('type', 'text');
    container.classList.add('a-singleine');
    console.log("args")
    console.log(args)
    console.log("type")
    console.log(args.type)
    switch (args.type) {
        case 'text':
            container.setAttribute('type', 'text');
            container.setAttribute('maxlength', args.maximum);
            break;
        case 'number':
            container.setAttribute('type', 'number');
            container.setAttribute('min', args.minimum);
            container.setAttribute('max', args.maximum);
            container.setAttribute('step', '1');
            break;
        case "date":
            container.setAttribute('type', 'date');
            container.setAttribute('min', args.minimum);
            container.setAttribute('max', args.maximum);
            break;
        case "range":
            container.setAttribute('type', 'range');
            container.setAttribute('min', args.minimum);
            container.setAttribute('max', args.maximum);
            break
    }

    container.setAttribute('min', args.minimum);
    return container;
}

export function AMultline(args:any): HTMLTextAreaElement {
    const container: HTMLTextAreaElement = document.createElement('textarea');
    container.classList.add('a-multiline');
    return container;
}
