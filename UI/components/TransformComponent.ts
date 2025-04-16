export default class TransformComponent {
    private xmlData: string;
    private xsltData: string;

    constructor(xmlData: string, xsltData: string) {
        this.xmlData = xmlData;
        this.xsltData = xsltData;
    }

    public transform(): HTMLElement {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(this.xmlData, "application/xml");
        const xsltDoc = parser.parseFromString(this.xsltData, "application/xml");

        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);

        const transformedDoc = xsltProcessor.transformToFragment(xmlDoc, document);

        const container = document.createElement("div");
        container.appendChild(transformedDoc);

        return container;
    }
}
