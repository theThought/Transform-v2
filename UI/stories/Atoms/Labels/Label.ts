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