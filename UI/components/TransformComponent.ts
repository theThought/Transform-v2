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

        // Perform the transformation
        const transformedDoc = xsltProcessor.transformToFragment(xmlDoc, document);

        // Check if the transformation was successful
        if (!transformedDoc) {
            throw new Error("XSLT transformation failed. Please check the XML and XSLT inputs.");
        }

        // Extract the content inside the <question> root element
        const questionElement = transformedDoc.querySelector("question");
        if (!questionElement) {
            throw new Error("The transformed document does not contain a <question> root element.");
        }

        const container = document.createElement("div");
        Array.from(questionElement.childNodes).forEach((child) => {
            container.appendChild(child.cloneNode(true));
        });

        return container;
    }
}
