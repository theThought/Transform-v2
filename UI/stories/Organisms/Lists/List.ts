import { MListOption_Story } from '../../Molecules/List/option';

export function OList_Story(args): HTMLElement {
    // Test restoring a pre-existing list entry by either supplying a value
    //for the hidden text field or setting the data-selected attribute on a
    // list entry. Do not set both!

    const textFieldValue = '';
    const listEntryIndex = 7;

    const component: HTMLElement = document.createElement('o-list');
    component.id = `${args.questionId}_list`;
    component.dataset.questiongroup = args.questionName;
    component.tabIndex = 0;

    component.setAttribute('data-properties', JSON.stringify(args.properties));

    const list = document.createElement('ul');
    list.classList.add('o-list');

    const input = document.createElement('input');
    input.id = `${args.questionId}`;
    input.type = 'hidden';
    input.value = textFieldValue;

    for (let i = 0; i < args.numberOfItems; i++) {
        const selected = i == listEntryIndex ? 'true' : 'false';
        const optionArgs = {
            content: `this is option ${i + 1}`,
            id: `_Q0_C${i}`,
            dataValue: `value_${i + 1}`,
            dataSelected: selected,
            iconType: args.iconType,
        };
        const item = MListOption_Story(optionArgs);
        list.appendChild(item);
    }

    component.appendChild(list);
    component.appendChild(input);
    return component;
}
