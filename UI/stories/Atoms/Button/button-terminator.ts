export function AButtonTerminator(args: any): HTMLElement {
    const container: HTMLElement = document.createElement(
        'a-button-terminator',
    );

    switch (args.type) {
        case 'behaviour':
            container.setAttribute('data-behaviour', args.behaviour);
    }
    return container;
}
