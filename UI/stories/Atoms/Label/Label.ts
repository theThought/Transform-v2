export function ALabelPre(theLabel?: string): HTMLSpanElement {
    const container: HTMLSpanElement = document.createElement('span');
    container.textContent = theLabel ?? null;
    container.classList.add('a-label-pre');
    return container;
}

export function ALabelPost(theLabel?: string): HTMLSpanElement {
    const container: HTMLSpanElement = document.createElement('span');
    container.textContent = theLabel ?? null;
    container.classList.add('a-label-post');
    return container;
}

export function ALabelPreBoxed(theLabel?: string): HTMLSpanElement {
    const container: HTMLSpanElement = document.createElement('span');
    container.textContent = theLabel ?? null;
    container.classList.add('a-label-pre-boxed');
    return container;
}

export function ALabelPostBoxed(theLabel?: string): HTMLSpanElement {
    const container: HTMLSpanElement = document.createElement('span');
    container.textContent = theLabel ?? null;
    container.classList.add('a-label-post-boxed');
    return container;
}

export function ALabelQuestion(theLabel: string): HTMLLabelElement {
    const container: HTMLLabelElement = document.createElement('label');
    container.setAttribute('for', 'q-text');
    container.setAttribute('id', 'q-label');
    container.classList.add('a-label-question');
    container.textContent = theLabel;
    return container;
}

export function ALabelOption(theLabel: string): HTMLLabelElement {
    const container: HTMLLabelElement = document.createElement('label');
    container.classList.add('a-label-option');
    container.textContent = theLabel;
    return container;
}

export function ALabelHeadingSublist(theLabel: string): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('a-label-sublist');
    container.textContent = theLabel;
    return container;
}

export function ALabelThumb(theLabel: number): HTMLElement {
    const container: HTMLElement = document.createElement('output');
    container.classList.add('a-label-thumb');
    container.textContent = theLabel.toString();
    return container;
}

export function ALabelMark(theLabel: number): HTMLElement {
    const container: HTMLElement = document.createElement('span');
    container.classList.add('a-label-mark');
    container.textContent = theLabel.toString();
    return container;
}

export function ALabelScale(theLabel: number): HTMLElement {
    const container: HTMLElement = document.createElement('span');
    container.classList.add('a-label-pre');
    container.textContent = theLabel.toString();
    return container;
}
