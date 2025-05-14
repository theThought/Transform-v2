import * as MLabel from '../../Molecules/Label/prepost';
import { MOptionBase_Story } from '../../Molecules/Option/base';

export function OSlider(args): HTMLElement {
    const outerContainer: HTMLElement = document.createElement('o-slider');
    outerContainer.setAttribute('data-properties', JSON.stringify(args));
    const prepostLabel = MLabel.MLabelPrePost(args.prelabel, args.postlabel);
    const preButton = document.createElement('a-button-terminator-pre');
    const postButton = document.createElement('a-button-terminator-post');
    const innerContainer = document.createElement('o-slider-container');
    const track = document.createElement('m-slider-track');
    track.setAttribute('data-properties', JSON.stringify(args));
    const rangeInput = document.createElement('input');
    const input = document.createElement('input');
    const marksContainer = document.createElement('div');
    const thumb = document.createElement('output');
    const marksLabelContainer = document.createElement('div');

    rangeInput.id = 'input_Q0';
    rangeInput.type = 'range';
    rangeInput.min = args.minimum;
    rangeInput.max = args.maximum;
    rangeInput.className = 'a-slider-input';
    input.type = 'hidden';
    input.min = args.minimum;
    input.max = args.maximum;
    thumb.className = 'a-label-thumb';
    thumb.setAttribute('for', 'input_Q0');
    outerContainer.style.width = args.width;
    marksContainer.className = 'm-divider-marks';
    marksLabelContainer.className = 'm-label-marks';

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

export function OSliderWithExclusive(args): HTMLElement {
    const oResponse: HTMLElement = document.createElement('o-response');
    oResponse.setAttribute('data-properties', JSON.stringify(args));
    const sublist: HTMLElement = document.createElement('o-sublist');
    const option: HTMLElement = MOptionBase_Story(args);
    const outerContainer: HTMLElement = document.createElement('o-slider');
    const prepostLabel = MLabel.MLabelPrePost(args.prelabel, args.postlabel);
    const preButton = document.createElement('a-button-terminator-pre');
    const postButton = document.createElement('a-button-terminator-post');
    const innerContainer = document.createElement('o-slider-container');
    const track = document.createElement('m-slider-track');
    const rangeInput = document.createElement('input');
    const input = document.createElement('input');
    const marksContainer = document.createElement('div');
    const thumb = document.createElement('output');
    const marksLabelContainer = document.createElement('div');

    rangeInput.id = 'input_Q0';
    rangeInput.type = 'range';
    rangeInput.min = args.minimum;
    rangeInput.max = args.maximum;
    rangeInput.className = 'a-slider-input';
    input.type = 'hidden';
    input.min = args.minimum;
    input.max = args.maximum;
    thumb.className = 'a-label-thumb';
    thumb.setAttribute('for', 'input_Q0');
    outerContainer.style.width = args.width;
    marksContainer.className = 'm-divider-marks';
    marksLabelContainer.className = 'm-label-marks';

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

    oResponse.appendChild(outerContainer);
    sublist.appendChild(option);
    oResponse.appendChild(sublist);

    return oResponse;
}
