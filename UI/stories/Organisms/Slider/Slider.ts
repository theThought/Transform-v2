import * as MLabel from '../../Molecules/Label/prepost';
import * as MDecorators from '../../Molecules/Slider/Slider';

export function OSlider(args): HTMLElement {
    const outerContainer: HTMLElement = document.createElement('o-slider');
    const prepostLabel = MLabel.MLabelPrePost(args.prelabel, args.postlabel);
    const preButton = document.createElement('a-button-terminator-pre');
    const postButton = document.createElement('a-button-terminator-post');
    const innerContainer = document.createElement('o-slider-container');
    const track = document.createElement('m-slider-track');
    const rangeInput = document.createElement('input');
    const input = document.createElement('input');
    const marksContainer = MDecorators.MSliderMarks(args);
    const thumb = document.createElement('output');
    const marksLabelContainer = MDecorators.MLabelMarks(args);

    rangeInput.id = 'input_Q0';
    rangeInput.type = 'range';
    rangeInput.min = args.minimum;
    rangeInput.max = args.maximum;
    rangeInput.step = args.step;
    rangeInput.classList.add('a-slider-input');
    input.type = 'hidden';
    thumb.className = 'a-label-thumb';
    thumb.setAttribute('for', 'input_Q0');
    track.style.width = args.width;

    outerContainer.appendChild(prepostLabel);
    outerContainer.appendChild(preButton);

    track.appendChild(thumb);
    track.appendChild(rangeInput);
    track.appendChild(marksContainer);

    innerContainer.appendChild(track);
    innerContainer.appendChild(marksLabelContainer);

    outerContainer.appendChild(innerContainer);
    outerContainer.appendChild(input);
    outerContainer.appendChild(postButton);

    return outerContainer;
}
