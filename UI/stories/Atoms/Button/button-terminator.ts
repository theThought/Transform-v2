export function AButtonTerminator(args: any): HTMLInputElement {
    const container: HTMLInputElement = document.createElement('a-button-terminator');

    switch (args.type) {
        case 'behaviour':
            container.setAttribute('data-behaviour', args.behaviour);
    }
    return container;
};

