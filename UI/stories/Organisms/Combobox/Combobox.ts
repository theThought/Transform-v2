import { OList_Story } from '../Lists/List';

export function ComboboxHtml(args): HTMLElement {
    const component: HTMLElement = document.createElement('o-combobox');
    component.className = 'o-select-custom';
    component.dataset.questiongroup = `${args.questionName}`;
    component.dataset.properties = JSON.stringify(args.properties);

    const input = document.createElement('input');
    input.id = `${args.questionId}_control`;
    input.type = 'text';
    input.className = 'a-input-combobox';
    input.placeholder = `${args.placeholder}`;

    const list = OList_Story(args);

    component.appendChild(input);
    component.appendChild(list);

    return component;
}
