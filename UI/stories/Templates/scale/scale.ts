import TransformUtils from '../../../utils/TransformUtils';

export function TScale_Story(
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

    const dataPropertiesString = JSON.stringify(args.properties);

    // Update attributes for Control elements
    controlElements.forEach((controlElement) => {
        if (args.minimum) {
            controlElement.setAttribute('MinValue', args.minimum.toString());
        }
        if (args.maximum) {
            controlElement.setAttribute('MaxValue', args.maximum.toString());
            controlElement.setAttribute(
                'Length',
                args.maximum.toString().length.toString(),
            );
        }
    });

    // Update the Width attribute in Style elements
    styleElements.forEach((styleElement) => {
        if (args.width) {
            styleElement.setAttribute('Width', args.width);
        }
        styleElement.setAttribute('Color', dataPropertiesString);
    });

    // Update the Color attribute in Question Style elements
    questionStyleElements.forEach((styleElement) => {
        styleElement.setAttribute('Color', dataPropertiesString);
    });

    const serializer = new XMLSerializer();
    const updatedXmlData = serializer.serializeToString(xmlDoc);

    const container = TransformUtils.transform(updatedXmlData, xslData);

    return container;
}
