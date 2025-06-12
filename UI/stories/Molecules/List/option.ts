export function MListOption_Story(args: any): HTMLElement {
    const container: HTMLLIElement = document.createElement('li');
    container.setAttribute('class', 'm-list-option');
    container.setAttribute('data-value', args.dataValue);
    container.setAttribute('id', args.id);
    container.textContent = args.content;
    return container;
}
