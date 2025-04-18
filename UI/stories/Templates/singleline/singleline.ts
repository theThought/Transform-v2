import TransformUtils from '../../../utils/TransformUtils';
import OResponse from '../../../src/javascript/web-components/o-response';
import MSingleline from '../../../src/javascript/web-components/m-singleline';
import MSinglelineDate from '../../../src/javascript/web-components/m-singleline-date';
import MSinglelineNumber from '../../../src/javascript/web-components/m-singleline-number';

export default class TSingleline {
    private elementResponse: OResponse;
    private elementSingleline: MSingleline | MSinglelineDate | MSinglelineNumber;
    private elementInput: HTMLInputElement;
    private singelineType: string;

    constructor(private xmlData: string, private xsltData: string, private singlelineType: string) {
        this.singelineType = singlelineType;
    }

    public render(): HTMLElement {
        const container = TransformUtils.transform(this.xmlData, this.xsltData);

        this.elementResponse = container.querySelector('o-response') as OResponse;

        // Dynamically locate and set the type of elementSingleline
        switch (this.singelineType) {
            case 'number':
                this.elementSingleline = container.querySelector('m-singleline-number') as MSinglelineNumber;
                break;
            case 'date':
                this.elementSingleline = container.querySelector('m-singleline-date') as MSinglelineDate;
                break;
            default:
                this.elementSingleline = container.querySelector('m-singleline') as MSingleline;
                break;
        }

        this.elementInput = container.querySelector('.a-singleline') as HTMLInputElement;

        if (!this.elementResponse || !this.elementSingleline || !this.elementInput) {
            throw new Error("The transformed document does not contain the required elements.");
        }

        return container;
    }

    public updateProperties(argTypes: Record<string, any>): void {
        if (!this.elementResponse || !this.elementSingleline || !this.elementInput) {
            console.warn("Elements not initialized. Call render() first.");
            return;
        }

        // Update data-properties for OResponse
        const dataProperties = {
            labels: {
                pre: argTypes.prelabel || '',
                post: argTypes.postlabel || '',
            },
            balance: {
                state: argTypes.balanceState || false,
                minWidth: argTypes.balanceMinWidth || '',
            },
            oneSize: {
                state: argTypes.oneSizeState || false,
                maxWidth: argTypes.oneSizeMaxWidth || '',
            },
        };
        this.elementResponse.setAttribute('data-properties', JSON.stringify(dataProperties));

        // Update input element attributes
        this.elementInput.setAttribute('type', argTypes.rtype || 'text');

        // Handle minimum and maximum based on singlelineType
        if (this.singlelineType === 'number' || this.singlelineType === 'date') {
            this.elementInput.setAttribute('min', argTypes.minimum?.toString() || '1');
            this.elementInput.setAttribute('max', argTypes.maximum?.toString() || '10');
        } else if (this.singlelineType === 'text') {
            this.elementInput.removeAttribute('min');
            this.elementInput.removeAttribute('max');
            this.elementInput.setAttribute('maxlength', argTypes.maximum?.toString() || '100');
        }

        // Apply the width and alignment styles
        const width = argTypes.width || '15em';
        const align = argTypes.align || 'left';
        this.elementInput.setAttribute(
            'style',
            `width: ${width}; text-align: ${align.toLowerCase()};`
        );
    }

    public syncArgTypes(args: Record<string, any>): void {
        if (!this.elementInput) {
            console.warn("Input element not initialized. Call render() first.");
            return;
        }

        // Update args based on the attributes in the transformed HTML
        args.rtype = this.elementInput.getAttribute('type') || args.rtype || 'text';

        if (this.singlelineType === 'number' || this.singlelineType === 'date') {
            args.minimum = parseInt(this.elementInput.getAttribute('min') || args.minimum || '1', 10);
            args.maximum = parseInt(this.elementInput.getAttribute('max') || args.maximum || '10', 10);
        } else if (this.singlelineType === 'text') {
            args.maximum = parseInt(this.elementInput.getAttribute('maxlength') || args.maximum || '100', 10);
        }

        args.width = this.elementInput.style.width || args.width || '15em';
        args.align = this.elementInput.style.textAlign || args.align || 'left';

        console.log("Synchronized args:", args);
    }
}