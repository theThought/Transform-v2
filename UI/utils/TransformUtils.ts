export default class TransformUtils {
    public static transform(xmlData: string, xsltData: string): HTMLElement {
        if (!xmlData || !xmlData.trim()) {
            throw new Error("XML data is empty or invalid.");
        }
        if (!xsltData || !xsltData.trim()) {
            throw new Error("XSLT data is empty or invalid.");
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "application/xml");
        const xsltDoc = parser.parseFromString(xsltData, "application/xml");

        const xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsltDoc);

        const transformedDoc = xsltProcessor.transformToFragment(xmlDoc, document);

        if (!transformedDoc) {
            throw new Error("XSLT transformation failed. Please check the XML and XSLT inputs.");
        }

        const container = document.createElement("div");
        Array.from(transformedDoc.childNodes).forEach((child) => {
            container.appendChild(child.cloneNode(true));
        });

        TransformUtils.upgradeCustomElements(container);

        return container;
    }

    private static upgradeCustomElements(container: HTMLElement): void {
        const allElements = container.querySelectorAll('*');

        allElements.forEach((el) => {
            const tagName = el.tagName.toLowerCase();

            if (customElements.get(tagName)) {
                const upgradedElement = document.createElement(tagName);

                Array.from(el.attributes).forEach((attr) => {
                    upgradedElement.setAttribute(attr.name, attr.value);
                });

                upgradedElement.innerHTML = el.innerHTML;
                el.replaceWith(upgradedElement);
            }
        });
    }
}