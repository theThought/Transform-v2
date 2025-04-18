import TransformUtils from '../../../utils/TransformUtils';
import OResponse from '../../../src/javascript/web-components/o-response';
import MSingleline from '../../../src/javascript/web-components/m-singleline';
import MSinglelineDate from '../../../src/javascript/web-components/m-singleline-date';
import MSinglelineNumber from '../../../src/javascript/web-components/m-singleline-number';

export default class TSingleline {
    private elementResponse: OResponse;
    private elementSingleline: MSingleline | MSinglelineDate | MSinglelineNumber;
    private elementInput: HTMLInputElement;

    constructor(private xmlData: string, private xsltData: string) {}

    public render(): HTMLElement {
        const container = TransformUtils.transform(this.xmlData, this.xsltData);

        this.elementResponse = container.querySelector('o-response') as OResponse;

        // Dynamically locate and set the type of elementSingleline
        if (this.xmlData.includes('<SinglelineNumber>')) {
            this.elementSingleline = container.querySelector('m-singleline-number') as MSinglelineNumber;
        } else if (this.xmlData.includes('<SinglelineDate>')) {
            this.elementSingleline = container.querySelector('m-singleline-date') as MSinglelineDate;
        } else {
            this.elementSingleline = container.querySelector('m-singleline') as MSingleline;
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
        this.elementInput.setAttribute('min', argTypes.minimum?.toString() || '1');
        this.elementInput.setAttribute('max', argTypes.maximum?.toString() || '10');

        // Apply the width and alignment styles
        const width = argTypes.width || '15em';
        const align = argTypes.align || 'left';
        this.elementInput.setAttribute(
            'style',
            `width: ${width}; text-align: ${align.toLowerCase()};`
        );
    }
}