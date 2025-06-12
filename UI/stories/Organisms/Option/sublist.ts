import * as MOptionBase from '../../Molecules/Option/base';

export function OOptionSublist_Story(args): HTMLElement {
    // Apply conditional logic for args
    if (args.optionType === 'single-answer') {
        args.exclusive = true;
        args.iconType = 'radio';
    } else {
        args.exclusive = false;
        args.iconType = 'checkbox';
    }

    const container = document.createElement('fieldset');
    const baseLabel = args.optionLabel;
    const sublistContainer: HTMLElement =
        document.createElement('o-option-sublist');

    container.setAttribute('role', 'group');
    container.setAttribute(
        'aria-labelledby',
        args.questionId + '_label_question',
    );

    // Create JSON for data-properties
    const dataPropertiesString = JSON.stringify(args.properties);

    // Update the Color attribute in Question Style elements
    sublistContainer.setAttribute('data-properties', dataPropertiesString);

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

    // Apply conditional logic for args
    if (args.optionType === 'single-answer') {
        args.exclusive = true;
        args.iconType = 'radio';
    } else {
        args.exclusive = false;
        args.iconType = 'checkbox';
    }

    for (let counter = 0; counter < args.optionCount; counter++) {
        args.categoryId = '_C' + counter;
        args.optionLabel = baseLabel + ' ' + counter;
        const singleOption: HTMLElement = MOptionBase.MOptionBase_Story(args);

        sublistContainer.appendChild(singleOption);
    }

    // Add "None of the above" option if IncludeNone is true
    if (args.IncludeNone) {
        const noneArgs = {
            ...args,
            exclusive: true,
            optionLabel: 'None of the above',
            categoryId: args.questionId + '_C' + args.optionCount,
            questionName: args.questionName,
        };
        console.log('noneArgs', noneArgs);

        const noneOption: HTMLElement = MOptionBase.MOptionBase_Story(noneArgs);
        sublistContainer.appendChild(noneOption);
    }

    container.appendChild(sublistContainer);
    return container;
}
