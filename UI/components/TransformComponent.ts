export default class TransformComponent {
    private xmlData: string;
    private xsltData: string;

    constructor(xmlData: string, xsltData: string) {
        this.xmlData = xmlData;
        this.xsltData = xsltData;
    }

    public transform(): HTMLElement {
        // Check if the XML or XSLT data is empty
        if (!this.xmlData || !this.xmlData.trim()) {
            throw new Error("XML data is empty or invalid.");
        }
        if (!this.xsltData || !this.xsltData.trim()) {
            throw new Error("XSLT data is empty or invalid.");
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(this.xmlData, "application/xml");
        const xsltDoc = parser.parseFromString(this.xsltData, "application/xml");

        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);

        // Perform the transformation
        const transformedDoc = xsltProcessor.transformToFragment(xmlDoc, document);

        // Check if the transformation was successful
        if (!transformedDoc) {
            console.error("XSLT Transformation Failed. XML or XSLT might be invalid.");
            throw new Error("XSLT transformation failed. Please check the XML and XSLT inputs.");
        }

        // Extract the content inside the <question> root element
        const questionElement = transformedDoc.querySelector("question");
        if (!questionElement) {
            console.error("The transformed document does not contain a <question> root element.");
            throw new Error("The transformed document does not contain a <question> root element.");
        }

        const container = document.createElement("div");
        Array.from(questionElement.childNodes).forEach((child) => {
            container.appendChild(child.cloneNode(true));
        });

        // Upgrade all custom elements in the container
        this.upgradeCustomElements(container);

        return container;
    }

    // Private method to upgrade custom elements
    private upgradeCustomElements(container: HTMLElement): void {
        const allElements = container.querySelectorAll('*'); // Select all elements in the container

        allElements.forEach((el) => {
            const tagName = el.tagName.toLowerCase();

            // Check if the element is a custom element and is registered
            if (customElements.get(tagName)) {
                const upgradedElement = document.createElement(tagName);

                // Copy attributes
                Array.from(el.attributes).forEach((attr) => {
                    upgradedElement.setAttribute(attr.name, attr.value);
                });

                // Copy innerHTML
                upgradedElement.innerHTML = el.innerHTML;

                // Replace the original element with the upgraded one
                el.replaceWith(upgradedElement);
            }
        });
    }
}