export function MOptionTab(args): HTMLElement {
    const component = document.createElement('m-option-tab');
    const disabled = args.optionStatus == 'disabled';
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
    inputElement.disabled = disabled;
    inputElement.defaultChecked = checked;
    component.appendChild(inputElement);

    const labelElement: HTMLLabelElement = document.createElement('label');
    labelElement.setAttribute('class', 'a-label-option');
    labelElement.setAttribute('for', args.questionId + args.categoryId);
    labelElement.textContent = args.optionLabel;
    component.appendChild(labelElement);

    return component;
}
