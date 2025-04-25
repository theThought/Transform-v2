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

    // Parse the XML and update attributes based on args
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");
    const controlElements = xmlDoc.querySelectorAll('Questions > Question > Control');
    const styleElements = xmlDoc.querySelectorAll('Questions > Question > Control > Style');

    // Update attributes based on args.type, args.minimum, args.maximum, and args.width
    controlElements.forEach((controlElement) => {
        if (args.type === 'text') {
            if (args.maximum) {
                controlElement.setAttribute('Length', args.maximum.toString());
            }
        } else if (args.type === 'number' || args.type === 'date') {
            if (args.minimum) {
                controlElement.setAttribute('MinValue', args.minimum.toString());
            }
            if (args.maximum) {
                controlElement.setAttribute('MaxValue', args.maximum.toString());
                if (args.type === 'number') {
                    controlElement.setAttribute('Length', args.maximum.toString().length.toString());
                } else if (args.type === 'date') {
                    controlElement.setAttribute('Length', '40');
                }
            }
        }
    });

    // Update the Width attribute in Style elements
    styleElements.forEach((styleElement) => {
        if (args.width) {
            styleElement.setAttribute('Width', args.width);
        }
    });

    const serializer = new XMLSerializer();
    const updatedXmlData = serializer.serializeToString(xmlDoc);

    const container = TransformUtils.transform(updatedXmlData, xslData);

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