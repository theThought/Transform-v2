import TransformUtils from '../../../utils/TransformUtils';
import OResponse from '../../../src/javascript/web-components/o-response';
import MSingleline from '../../../src/javascript/web-components/m-singleline';
import MSinglelineDate from '../../../src/javascript/web-components/m-singleline-date';
import MSinglelineNumber from '../../../src/javascript/web-components/m-singleline-number';

export function TSingleLine_Story(args: any, loaded: { xmlData: string; xslData: string }): HTMLElement {
    const { xmlData, xslData } = loaded;

    if (!xmlData || !xslData) {
        throw new Error("Missing required XML or XSLT data.");
    }

    const container = TransformUtils.transform(xmlData, xslData);

    const elementResponse = container.querySelector('o-response') as OResponse;
    let elementSingleline: MSingleline | MSinglelineDate | MSinglelineNumber;
    const elementInput = container.querySelector('.a-singleline') as HTMLInputElement;

    switch (args.type) {
        case 'number':
            elementSingleline = container.querySelector('m-singleline-number') as MSinglelineNumber;
            break;
        case 'date':
            elementSingleline = container.querySelector('m-singleline-date') as MSinglelineDate;
            break;
        default:
            elementSingleline = container.querySelector('m-singleline') as MSingleline;
            break;
    }

    if (!elementResponse || !elementSingleline || !elementInput) {
        throw new Error("The transformed document does not contain the required elements.");
    }

    return container;
}