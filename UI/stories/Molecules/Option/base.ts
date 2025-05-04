import MOptionBase from '../../../src/javascript/web-components/m-option-base';

export function MOptionBase_Story(args: any): HTMLElement {
    const container: HTMLElement = document.createElement('m-option-base');
    console.debug('MOptionBase_Story', args);
    if (args.exclusive || args.iconType === 'radio') {
        container.setAttribute('data-exclusive', args.exclusive);
        container.setAttribute('data-question-id', args.questionId);
        container.setAttribute('data-question-group', args.questionName);
        container.setAttribute('class', 'below');
        container.setAttribute('data-hidden', 'false');

        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.setAttribute('type', 'radio');
        inputElement.setAttribute('id', args.questionId + args.categoryId);
        inputElement.setAttribute('name', args.questionName);
        inputElement.setAttribute('data-question-group', args.questionName);
        container.appendChild(inputElement);

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', args.questionId + args.categoryId);

        const iconElement = document.createElement('span');
        iconElement.setAttribute('class', 'a-icon-multistate');
        iconElement.setAttribute('data-icon-type', args.iconType);
        labelElement.appendChild(iconElement);

        const textElement = document.createElement('span');
        textElement.setAttribute('class', 'a-label-option');
        textElement.textContent = args.optionLabel;
        labelElement.appendChild(textElement);
        container.appendChild(labelElement);
    } else if (args.iconType === 'check') {
        container.setAttribute('class', 'm-option-multiple-answer');

        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'checkbox');
        inputElement.setAttribute('id', args.questionId + args.categoryId);
        inputElement.setAttribute('name', args.questionName);
        inputElement.setAttribute('data-question-group', args.questionName);
        container.appendChild(inputElement);

        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', args.questionId + args.categoryId);

        const iconElement = document.createElement('span');
        iconElement.setAttribute('class', 'a-icon-multistate');
        iconElement.setAttribute('data-icon-type', args.iconType);
        labelElement.appendChild(iconElement);

        const textElement = document.createElement('span');
        textElement.setAttribute('class', 'a-label-option');
        textElement.textContent = args.optionLabel;
        labelElement.appendChild(textElement);
        container.appendChild(labelElement);
    }
    return container;
}
/**
 <m-option-base class="m-option-single-answer">
    <input type="radio" id="radio1" name="radios" />
    <label for="radio1">
        <span class="a-icon-multistate" data-icon-type="single"></span>
        <span class="a-label-option">
            Radio label
        </span>
    </label>
</m-option-base>
 */
