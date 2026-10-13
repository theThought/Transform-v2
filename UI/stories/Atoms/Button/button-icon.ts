export function AButtonIcon_Story(args: any): HTMLElement {
    const container: HTMLElement = document.createElement('a-button-icon');
    if (args.className) {
        container.className = args.className;
    }
    if (args.label) {
        container.textContent = args.label;
    }
    if (args.innerHTML) {
        container.innerHTML = args.innerHTML;
    }
    return container;
}
