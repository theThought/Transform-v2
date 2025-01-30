import { generateCustomPropertiesJSON } from '../utils/helpers';
import Component from './component';

export default class MInputSinglelineedit extends Component {
    private qid: string | undefined;
    private qgroup: string | undefined;
    private element: HTMLInputElement | null;
    private question: HTMLElement | null;

    constructor() {
        super();

        this.qid = this.dataset.questionid;
        this.qgroup = this.dataset.questiongroup;
        this.element = document.querySelector('.a-input-singlelineedit');
        this.question = this.closest('o-question-response');

        if (!this.element) return;

        this.init();

        this.element.addEventListener('click', this);
        this.element.addEventListener('change', this);
    }

    private init(): void {
        console.log(
            'MInputSinglelineedit: init...',
            this.qid,
            this.qgroup,
            this.element,
        );

        this.broadcastChange('message from the child using Component class.');
        this.parseCustomProperties();
    }

    // TODO: should this be a generic method in Component.ts?
    private parseCustomProperties(): void {
        const dataCustomProps = this.question?.dataset.customprops;

        if (
            this.qid !== this.question?.dataset.questionid &&
            this.qgroup !== this.question?.dataset.questiongroup &&
            !dataCustomProps
        ) {
            return;
        }

        if (dataCustomProps) {
            let customPropsJSON: Record<string, unknown>;

            if (dataCustomProps.includes('type')) {
                customPropsJSON = generateCustomPropertiesJSON(
                    dataCustomProps,
                    'type',
                );
                this.setInputType(customPropsJSON);
            }

            if (dataCustomProps.includes('labels')) {
                customPropsJSON = generateCustomPropertiesJSON(
                    dataCustomProps,
                    'labels',
                );
                this.setLabels(customPropsJSON);
            }
        }
    }

    // Set the appropriate 'type' attribute on <input> based on custom properties.
    private setInputType(customPropsJSON: Record<string, unknown>): void {
        let inputType = customPropsJSON.type as string;

        switch (inputType) {
            case 'date':
                inputType = 'date';
                break;
            case 'number':
                inputType = 'number';
                break;
            default:
                inputType = 'text';
                break;
        }

        if (this.element) {
            this.element.type = inputType;
        }
    }

    // Set pre-/post-labels.
    // TODO: See https://app.clickup.com/t/8697h5cc4?comment=90120097089630&threadedComment=90120097249142
    private setLabels(customPropsJSON: Record<string, unknown>): void {
        const labels = customPropsJSON.labels as Record<string, unknown>;

        for (const [key, value] of Object.entries(labels)) {
            if (key === 'pre' && value) {
                const elemPre = document.createElement('span');
                elemPre.classList.add('a-label-prelabel');
                elemPre.textContent = value as string;

                this.insertBefore(elemPre, this.element);
            }

            if (key === 'post' && value) {
                const elemPre = document.createElement('span');
                elemPre.classList.add('a-label-postlabel');
                elemPre.textContent = value as string;

                this.appendChild(elemPre);
            }
        }
    }

    // Handle constructor() event listeners.
    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                console.log('click');
                break;
            case 'change':
                console.log('change');
                break;
        }
    }

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        // e.g. document.addEventListener('broadcastChange', ...);
    }

    public disconnectedCallback(): void {
        // e.g. document.removeEventListener('broadcastChange', ...);
    }
}
