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

export function visible(elem: HTMLInputElement): boolean {
    return !(elem.clientHeight === 0 || elem.clientWidth === 0);
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

function isJsonObject(value: unknown): value is JsonObject {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function mergeDeep(...objects: object[]): JsonObject {
    return objects.reduce<JsonObject>((prev, obj) => {
        const next = { ...prev };
        const jsonObj = obj as JsonObject;

        Object.keys(jsonObj).forEach((key) => {
            // Security: Prevent prototype pollution from user-set properties
            if (key === '__proto__' || key === 'constructor') {
                return;
            }

            const pVal = next[key];
            const oVal = jsonObj[key];

            if (Array.isArray(pVal) && Array.isArray(oVal)) {
                next[key] = pVal.concat(oVal);
            } else if (isJsonObject(pVal) && isJsonObject(oVal)) {
                next[key] = mergeDeep(pVal, oVal);
            } else {
                next[key] = oVal;
            }
        });

        return next;
    }, {});
}
