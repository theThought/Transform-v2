import {
    ALabelPre,
    ALabelPost,
    ALabelPreBoxed,
    ALabelPostBoxed,
} from '../../Atoms/Label/Label';

export function MLabelPrePost(
    prelabel?: string,
    postlabel?: string,
): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    const preLabel: HTMLSpanElement = ALabelPre(prelabel);
    const postLabel: HTMLSpanElement = ALabelPost(postlabel);

    container.classList.add('m-label-prepost');
    container.appendChild(preLabel);
    container.appendChild(postLabel);

    return container;
}

export function MLabelPrePostBoxed(
    prelabel?: string,
    postlabel?: string,
): HTMLDivElement {
    const container: HTMLDivElement = document.createElement('div');
    const preLabel: HTMLSpanElement = ALabelPreBoxed(prelabel);
    const postLabel: HTMLSpanElement = ALabelPostBoxed(postlabel);

    container.classList.add('m-label-prepost');
    container.appendChild(preLabel);
    container.appendChild(postLabel);

    return container;
}
