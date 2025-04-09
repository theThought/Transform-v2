import { ALabelPre, ALabelPost } from '../../Atoms/Labels/Label';


export function MLabelPrePost(): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    const preLabel = ALabelPre('prelabel');
    const postLabel = ALabelPost('postlabel');

    container.classList.add('m-label-prepost');
    container.appendChild(preLabel);
    container.appendChild(postLabel);

    return container;
  }