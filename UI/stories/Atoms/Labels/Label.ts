// label.ts
export function ALabelPre(theLabel:string): HTMLSpanElement {
    const container: HTMLSpanElement = document.createElement('span');
    container.textContent = theLabel;
    container.classList.add('a-label-pre');
    return container;
}

export function ALabelPost(theLabel:string): HTMLSpanElement {
    const container: HTMLSpanElement = document.createElement('span');
    container.textContent = theLabel;
    container.classList.add('a-label-pre');
    return container;
};

export function ALabelQuestion(content = ''): HTMLLabelElement {
    const container: HTMLLabelElement = document.createElement('label');
    container.setAttribute('for', 'q-text');
    container.setAttribute('id', 'q-label');
    container.classList.add('a-label-question');

    container.textContent = content;
    return container;
}

export function ALabelOption(content = ''): HTMLLabelElement {
    const container: HTMLLabelElement = document.createElement('label');
    container.classList.add('a-label-option');

    container.textContent = content;
    return container;
}

export function ALabelHeadingSublist(content = ''): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('a-label-sublist');

    container.textContent = content;
    return container;
}

export function ALabelThumb(content = ''): HTMLLabelElement {
    const container: HTMLLabelElement = document.createElement('label');
    container.classList.add('a-label-thumb');

    container.textContent = content;
    return container;
}
