// label.ts
export function ALabelPre(content: string = ''): HTMLSpanElement {
    const span: HTMLSpanElement = document.createElement('span');
    span.textContent = content;
    span.classList.add('a-label-pre'); 
    return span;
  }

  export function ALabelPost(content: string = ''): HTMLSpanElement {
    const span: HTMLSpanElement = document.createElement('span');
    span.textContent = content;
    span.classList.add('a-label-post'); 
    return span;
  }

  export function ALabelQuestion(content: string = ''): HTMLLabelElement {
    const span: HTMLLabelElement = document.createElement('label');
    span.setAttribute('for', 'q-text');
    span.setAttribute('id', 'q-label');
    span.classList.add('a-label-question');

    span.textContent = content;
    return span;
  }

  export function ALabelOption(content: string = ''): HTMLLabelElement {
    const span: HTMLLabelElement = document.createElement('label');
    span.classList.add('a-label-option');

    span.textContent = content;
    return span;
  }

  export function ALabelHeadingSublist(content: string = ''): HTMLDivElement {
    const span: HTMLDivElement = document.createElement('div');
    span.classList.add('a-label-sublist');

    span.textContent = content;
    return span;
  }

