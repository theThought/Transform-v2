import { MList_Story } from '../../Molecules/Lists/List';

export function DropdownHtml(args): HTMLElement {
    const component: HTMLElement = document.createElement('o-dropdown');
    component.className = 'o-select-custom';
    component.dataset.questiongroup = `${args.questionName}`;
    component.dataset.properties = JSON.stringify(args.properties);

    const input = document.createElement('input');
    input.id = `${args.questionId}_control`;
    input.type = 'text';
    input.className = 'a-input-dropdown';

    const list = MList_Story(args);

    component.appendChild(input);
    component.appendChild(list);

    return component;
}
