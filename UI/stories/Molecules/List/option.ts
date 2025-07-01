export function MListOption_Story(args: any): HTMLElement {
    const container: HTMLLIElement = document.createElement('li');
    container.setAttribute('class', 'm-list-option');
    container.setAttribute('data-value', args.dataValue);
    container.setAttribute('id', args.id);

    if (args.state) container.dataset.selected = 'true';

    const labelElement = document.createElement('label');

    const iconElement = document.createElement('span');
    iconElement.setAttribute('class', 'a-icon-multistate');
    iconElement.setAttribute('data-icon-type', args.iconType);
    labelElement.appendChild(iconElement);

    const textElement = document.createElement('span');
    textElement.setAttribute('class', 'a-label-option');
    textElement.textContent = args.content;
    labelElement.appendChild(textElement);
    container.appendChild(labelElement);

    return container;
}
