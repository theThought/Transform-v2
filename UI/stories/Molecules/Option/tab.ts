export function MOptionTab(args): HTMLElement {
    const component = document.createElement('m-option-tab');
    const readonly = args.optionStatus == 'readonly';
    const checked = args.optionStatus == 'selected';

    component.setAttribute('data-exclusive', args.exclusive);
    component.setAttribute('data-question-id', args.questionId);
    component.setAttribute('data-question-group', args.questionName);
    component.setAttribute('data-checked', String(checked));

    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.setAttribute('type', 'radio');
    inputElement.setAttribute('id', args.questionId + args.categoryId);
    inputElement.setAttribute('name', args.questionName);
    inputElement.setAttribute('data-question-group', args.questionName);
    inputElement.readOnly = readonly;
    inputElement.defaultChecked = checked;
    component.appendChild(inputElement);

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', args.questionId + args.categoryId);

    const iconElement = document.createElement('span');
    iconElement.setAttribute('class', 'a-icon-multistate');
    iconElement.setAttribute('data-icon-type', args.iconType);
    labelElement.appendChild(iconElement);

    const textElement = document.createElement('span');
    textElement.setAttribute('class', 'a-label-option');
    textElement.innerHTML = args.optionLabel;
    labelElement.appendChild(textElement);
    component.appendChild(labelElement);

    return component;
}
