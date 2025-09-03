export function MOptionBoolean(args: any): HTMLElement {
    const container: HTMLElement = document.createElement('m-option-boolean');
    const containerClass = 'm-option-boolean';
    const inputType: string =
        args.optionType === 'single-answer' ? 'radio' : 'checkbox';
    const customProperties = JSON.stringify(args.properties);

    container.setAttribute('data-exclusive', args.exclusive);
    container.setAttribute('data-question-id', args.questionId);
    container.setAttribute('data-question-group', args.questionName);

    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.setAttribute('type', inputType);
    inputElement.setAttribute('id', args.questionId + args.categoryId);
    inputElement.setAttribute('name', args.questionName);
    inputElement.setAttribute('data-question-group', args.questionName);
    container.appendChild(inputElement);

    const iconElement = document.createElement('span');
    iconElement.setAttribute('class', 'a-icon-multistate');
    iconElement.setAttribute('data-icon-type', args.iconType);
    container.appendChild(iconElement);

    return container;
}
