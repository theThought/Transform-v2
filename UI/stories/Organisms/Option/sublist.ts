import * as MOptionBase from '../../Molecules/Option/base';

export function OOptionSublist_Story(args): HTMLElement {
    const container = document.createElement('fieldset');
    const baseLabel = args.optionLabel;
    const sublistContainer: HTMLElement =
        document.createElement('o-option-sublist');

    container.setAttribute('role', 'group');
    container.setAttribute(
        'aria-labelledby',
        args.questionId + '_label_question',
    );

    sublistContainer.setAttribute('role', 'group');
    sublistContainer.setAttribute(
        'aria-labelledby',
        args.questionId + '_label_question',
    );

    if (args.balanceState) {
        sublistContainer.setAttribute('class', 'balance');
    }

    if (args.heading !== '') {
        const headingElement = document.createElement('legend');
        headingElement.setAttribute('class', 'a-label-heading-sublist');
        headingElement.textContent = args.heading;
        sublistContainer.appendChild(headingElement);
    }

    for (let counter = 0; counter < args.optionCount; counter++) {
        args.categoryId = '_C' + counter;
        args.optionLabel = baseLabel + ' ' + counter;
        const singleOption: HTMLElement = MOptionBase.MOptionBase_Story(args);

        sublistContainer.appendChild(singleOption);
    }
    container.appendChild(sublistContainer);
    return container;
}
