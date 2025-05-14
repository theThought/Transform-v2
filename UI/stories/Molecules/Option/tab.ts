export function MOptionTab(args): HTMLElement {
    const component = document.createElement('m-option-tab');

    component.setAttribute('data-exclusive', 'true');
    component.setAttribute('data-question-id', args.questionId);
    component.setAttribute('data-question-group', args.questionName);

    const inputElement: HTMLInputElement = document.createElement('input');
    inputElement.setAttribute('type', 'radio');
    inputElement.setAttribute('id', args.questionId + args.categoryId);
    inputElement.setAttribute('name', args.questionName);
    inputElement.setAttribute('data-question-group', args.questionName);
    component.appendChild(inputElement);

    const labelElement: HTMLLabelElement = document.createElement('label');
    labelElement.setAttribute('class', 'a-label-option');
    labelElement.setAttribute('for', args.questionId + args.categoryId);
    labelElement.textContent = args.optionLabel;
    component.appendChild(labelElement);

    return component;
}
