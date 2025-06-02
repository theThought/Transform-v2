import { AListOption_Story } from '../../Atoms/List/option';

export function MList_Story(args): HTMLElement {
    const component: HTMLElement = document.createElement('m-list');
    component.id = `${args.questionId}_list`;
    component.setAttribute('data-questiongroup', `_Q${args.questionName}`);

    const list = document.createElement('ul');
    list.classList.add('m-list');

    const input = document.createElement('input');
    input.id = `${args.questionId}`;
    input.type = 'hidden';
    input.value = 'value_2';

    for (let i = 0; i < args.numberOfItems; i++) {
        const optionArgs = {
            content: `this is option ${i + 1}`,
            id: `_Q0_C${i}`,
            dataValue: `category${i + 1}`,
        };
        const item = AListOption_Story(optionArgs);
        list.appendChild(item);
    }

    component.appendChild(list);
    component.appendChild(input);
    return component;
}
