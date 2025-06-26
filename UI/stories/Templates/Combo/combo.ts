import TransformUtils from '../../../utils/TransformUtils';

export function TCombo_Story(
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

    const styleControlElements = xmlDoc.querySelectorAll(
        'Questions > Question > Control > Style > Control',
    );

    const questionStyleControlElements = xmlDoc.querySelectorAll(
        'Questions > Question > Style > Control',
    );

    const questionStyleElements = xmlDoc.querySelectorAll(
        'Questions > Question > Style',
    );
    const dataProperties: any = {
        listsize: args.properties.listsize || 8,
        exact: args.properties.exact || true,
        filtertype: args.properties.filtertype || 'contains',
        mincharactersforlist: args.properties.mincharactersforlist || 0,
        notenoughcharacters: args.properties.notenoughcharacters || '',
        noitemsinlist: args.properties.noitemsinlist || 'No items found',
    };

    // Create JSON for data-properties
    const dataPropertiesString = JSON.stringify(dataProperties);

    // Update the Color attribute in Question Style elements
    questionStyleElements.forEach((styleElement) => {
        styleElement.setAttribute('Color', dataPropertiesString);
    });

    styleControlElements.forEach((controlElement) => {
        controlElement.setAttribute('placeholder', args.placeholder || '');
    });

    questionStyleControlElements.forEach((controlElement) => {
        controlElement.setAttribute('placeholder', args.placeholder || '');
    });
    const serializer = new XMLSerializer();
    const updatedXmlData = serializer.serializeToString(xmlDoc);

    const container = TransformUtils.transform(updatedXmlData, xslData);

    return container;
}
