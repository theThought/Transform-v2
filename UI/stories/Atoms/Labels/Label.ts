// label.ts
export function createLabelPre(content: string = ''): HTMLSpanElement {
    const span: HTMLSpanElement = document.createElement('span');
    span.textContent = content;
    span.classList.add('a-label-pre'); 
    return span;
  }