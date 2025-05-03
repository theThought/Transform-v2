import MOptionBase from '../../../src/javascript/web-components/m-option-base';

export function MOptionBase_Story(args: any): HTMLElement {
    const container: MOptionBase = document.createElement('m-option-base');
    if (args.exclusive || args.type === 'radio') {
        container.setAttribute('class', 'm-option-single-answer');
        const inputElement: HTMLInputElement = document
            .createElement('input')
            .setAttribute('type', 'radio')
            .setAttribute('id', args.questionId + args.categoryId)
            .setAttribute('name', args.questionName);
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
    } else if (args.type === 'checkbox') {
        container.setAttribute('class', 'm-option-multiple-answer');
        const inputElement = document
            .createElement('input')
            .setAttribute('type', 'checkbox')
            .setAttribute('id', args.questionId + args.categoryId)
            .setAttribute('name', args.questionName);
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
