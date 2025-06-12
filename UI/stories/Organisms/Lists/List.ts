import { MListOption_Story } from '../../Molecules/List/option';

export function OList_Story(args): HTMLElement {
    const component: HTMLElement = document.createElement('o-list');
    component.id = `${args.questionId}_list`;
    component.dataset.questiongroup = args.questionName;
    component.tabIndex = 0;

    const list = document.createElement('ul');
    list.classList.add('o-list');

    const input = document.createElement('input');
    input.id = `${args.questionId}`;
    input.type = 'hidden';
    input.value = 'value_2';

    for (let i = 0; i < args.numberOfItems; i++) {
        const optionArgs = {
            content: `this is option ${i + 1}`,
            id: `_Q0_C${i}`,
            dataValue: `value_${i + 1}`,
            iconType: 'checkbox',
        };
        const item = MListOption_Story(optionArgs);
        list.appendChild(item);
    }

    component.appendChild(list);
    component.appendChild(input);
    return component;
}
