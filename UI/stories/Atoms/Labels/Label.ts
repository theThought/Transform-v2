// label.ts
export function ALabelPre(content: string = ''): HTMLSpanElement {
    const container: HTMLSpanElement = document.createElement('span');
    container.textContent = content;
    container.classList.add('a-label-pre'); 
    return container;
  }

  export function ALabelPost(content: string = ''): HTMLSpanElement {
    const container: HTMLSpanElement = document.createElement('span');
    container.textContent = content;
    container.classList.add('a-label-post'); 
    return container;
  }

  export function ALabelQuestion(content: string = ''): HTMLLabelElement {
    const container: HTMLLabelElement = document.createElement('label');
    container.setAttribute('for', 'q-text');
    container.setAttribute('id', 'q-label');
    container.classList.add('a-label-question');

    container.textContent = content;
    return container;
  }

  export function ALabelOption(content: string = ''): HTMLLabelElement {
    const container: HTMLLabelElement = document.createElement('label');
    container.classList.add('a-label-option');

    container.textContent = content;
    return container;
  }

  export function ALabelHeadingSublist(content: string = ''): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    container.classList.add('a-label-sublist');

    container.textContent = content;
    return container;
  }

  export function ALabelThumb(content: string = ''): HTMLLabelElement {
    const container: HTMLLabelElement = document.createElement('label');
    container.classList.add('a-label-thumb');

    container.textContent = content;
    return container;
  }