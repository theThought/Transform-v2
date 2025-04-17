import TransformUtils from '../utils/TransformUtils';
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
        this.elementSingleline = container.querySelector('m-singleline') as MSingleline;
        this.elementInput = container.querySelector('.a-singleline') as HTMLInputElement;

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
        this.elementInput.setAttribute(
            'style',
            `width: ${argTypes.width || '15em'}; text-align: ${argTypes.align || 'left'};`
        );
    }
}