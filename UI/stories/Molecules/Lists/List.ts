export function ListOptions(args): HTMLElement {
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
        const item = document.createElement('li');
        item.id = `${args.questionId}_${args.categoryId}${i}`;
        item.classList.add('a-option-list');
        item.setAttribute('data-value', `value_${i + 1}`);
        item.innerHTML = `${args.itemLabel} ${i + 1}`;
        list.appendChild(item);
    }

    component.appendChild(list);
    component.appendChild(input);
    return component;
}
