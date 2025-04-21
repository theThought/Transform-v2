// input.ts
export function ASingleline(args:any): HTMLInputElement {
    const container: HTMLInputElement = document.createElement('input');
    container.setAttribute('type', 'text');
    container.classList.add('a-singleine');
    return container;
}

export function AMultline(args:any): HTMLTextAreaElement {
    const container: HTMLTextAreaElement = document.createElement('textarea');
    container.classList.add('a-multiline');
    return container;
}
