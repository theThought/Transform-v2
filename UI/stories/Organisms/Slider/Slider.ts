import * as MLabel from '../../Molecules/Label/prepost';

export function OSlider(args): HTMLElement {
    const outerContainer: HTMLElement = document.createElement('o-slider');
    const prepostLabel = MLabel.MLabelPrePost(args.prelabel, args.postlabel);
    const preButton = document.createElement('a-button-terminator-pre');
    const postButton = document.createElement('a-button-terminator-post');
    const innerContainer = document.createElement('o-slider-container');
    const track = document.createElement('m-slider-track');
    const rangeInput = document.createElement('input');
    const input = document.createElement('input');
    const marksContainer = document.createElement('m-divider-marks');
    const mark = document.createElement('a-divider-mark');
    const thumb = document.createElement('output');
    const marksLabelContainer = document.createElement('m-label-marks');
    const labelMark = document.createElement('a-label-mark');

    rangeInput.id = 'input_Q0';
    rangeInput.type = 'range';
    rangeInput.classList.add('a-slider-input');
    input.type = 'hidden';
    thumb.className = 'a-label-thumb';
    thumb.setAttribute('for', 'input_Q0');
    track.style.width = args.width;

    outerContainer.appendChild(prepostLabel);
    outerContainer.appendChild(preButton);

    marksContainer.appendChild(mark);

    track.appendChild(thumb);
    track.appendChild(rangeInput);
    track.appendChild(marksContainer);

    innerContainer.appendChild(track);

    marksLabelContainer.appendChild(labelMark);

    innerContainer.appendChild(marksLabelContainer);

    outerContainer.appendChild(innerContainer);
    outerContainer.appendChild(input);
    outerContainer.appendChild(postButton);

    return outerContainer;
}
