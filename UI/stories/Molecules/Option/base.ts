export function MOptionBase_Story(args: any): HTMLElement {
    const container: HTMLElement = document.createElement('m-option-base');
    const containerClass: string = 'm-option-' + args.optionType;
    const inputType: string =
        args.optionType === 'single-answer' ? 'radio' : 'checkbox';
    const customProperties = args.properties
        ? JSON.stringify(args.properties)
        : '';

    container.setAttribute('data-exclusive', args.exclusive);
    container.setAttribute('data-question-id', args.questionId);
    container.setAttribute('data-question-group', args.questionName);
    container.setAttribute('class', containerClass + ' below');
    container.setAttribute('data-hidden', 'false');
    container.setAttribute('data-properties', customProperties);

    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.setAttribute('type', inputType);
    inputElement.setAttribute('id', args.questionId + args.categoryId);
    inputElement.setAttribute('name', args.questionName);
    inputElement.setAttribute('data-question-group', args.questionName);
    container.appendChild(inputElement);

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', args.questionId + args.categoryId);

    const iconElement = document.createElement('span');
    iconElement.setAttribute('class', 'a-icon-multistate');
    iconElement.setAttribute('data-icon-type', args.iconType);
    labelElement.appendChild(iconElement);

    const textElement = document.createElement('span');
    textElement.setAttribute('class', 'a-label-option');
    textElement.textContent = args.optionLabel;
    labelElement.appendChild(textElement);
    container.appendChild(labelElement);

    return container;
}
