import TransformUtils from '../../../utils/TransformUtils';
import OResponse from '../../../src/javascript/web-components/o-response';
import OScale from '../../../src/javascript/web-components/o-scale';
import MScaleContainer from '../../../src/javascript/web-components/m-scale-container';
import AScaleUnit from '../../../src/javascript/web-components/a-scale-unit';

export function TScale_Story(args: any, loaded: { xmlData: string; xslData: string }): HTMLElement {
    const { xmlData, xslData } = loaded;

    if (!xmlData || !xslData) {
        throw new Error("Missing required XML or XSLT data.");
    }

    // Parse the XML and update the Width attribute
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");
    const styleElements = xmlDoc.querySelectorAll('Questions > Question > Control > Style');

    styleElements.forEach((styleElement) => {
        if (args.width) {
            styleElement.setAttribute('Width', args.width);
        }
    });

    const serializer = new XMLSerializer();
    const updatedXmlData = serializer.serializeToString(xmlDoc);

    const container = TransformUtils.transform(updatedXmlData, xslData);

    const elementResponse = container.querySelector('o-response') as OResponse;
    const elementScale = container.querySelector('o-scale') as OScale;
    const elementScaleContainer = container.querySelector('.o-scale-container') as MScaleContainer;
    const elementUnits = container.querySelector('.a-scale-unit') as AScaleUnit;

    return container;
}