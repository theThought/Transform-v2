export function removeHTMLWhitespace(html: string): string {
    html = '>' + html + '<';
    html = html.replace(/>\s+</gim, '><');
    html = html.substring(1, html.length - 1);
    return html;
}

export function decodeHTML(html: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
}

export function replaceHTMLPlaceholder(html: string): string {
    html = html.replace(/%gt%/g, '>');
    html = html.replace(/%lt%/g, '<');
    return html;
}

export function mergeDeep(
    ...objects: Record<string, any>[]
): Record<string, any> {
    const isObject = (obj: object): boolean => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
        Object.keys(obj).forEach((key) => {
            const pVal = prev[key];
            const oVal = obj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                prev[key] = pVal.concat(...oVal);
            } else if (isObject(pVal) && isObject(oVal)) {
                prev[key] = mergeDeep(pVal, oVal);
            } else {
                prev[key] = oVal;
            }
        });

        return prev;
    }, {});
}
