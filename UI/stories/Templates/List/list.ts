import TransformUtils from '../../../utils/TransformUtils';

export function TList_Story(
    args: any,
    loaded: { xmlData: string; xslData: string },
): HTMLElement {
    const { xmlData, xslData } = loaded;

    if (!xmlData || !xslData) {
        throw new Error('Missing required XML or XSLT data.');
    }

    // Parse the XML and update attributes based on args
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
    const controlElements = xmlDoc.querySelectorAll(
        'Questions > Question > Control',
    );
    const styleElements = xmlDoc.querySelectorAll(
        'Questions > Question > Control > Style',
    );
    const questionStyleElements = xmlDoc.querySelectorAll(
        'Questions > Question > Style',
    );
    const dataProperties: any = {
        listsize: args.properties.listsize || null,
    };

    // Create JSON for data-properties
    const dataPropertiesString = JSON.stringify(dataProperties);

    // Update the Color attribute in Question Style elements
    questionStyleElements.forEach((styleElement) => {
        styleElement.setAttribute('Color', dataPropertiesString);
    });

    const serializer = new XMLSerializer();
    const updatedXmlData = serializer.serializeToString(xmlDoc);

    const container = TransformUtils.transform(updatedXmlData, xslData);

    return container;
}
