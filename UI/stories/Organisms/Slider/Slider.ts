import * as MLabel from '../../Molecules/Label/prepost';
import { MOptionBase_Story } from '../../Molecules/Option/base';

export function OSlider(args): HTMLElement {
    const outerContainer: HTMLElement = document.createElement('o-slider');
    const prepostLabel = MLabel.MLabelPrePost();
    const preLabel = document.createElement('span');
    const postLabel = document.createElement('span');
    const preButton = document.createElement('a-button-terminator');
    const postButton = document.createElement('a-button-terminator');
    const innerContainer = document.createElement('div');
    const trackContainer = document.createElement('div');
    const track = document.createElement('m-slider-track');
    const rangeInput = document.createElement('input');
    const input = document.createElement('input');
    const marksContainer = document.createElement('div');
    const thumb = document.createElement('output');
    const marksLabelContainer = document.createElement('div');

    outerContainer.setAttribute(
        'data-properties',
        JSON.stringify(args.properties),
    );
    track.setAttribute('data-properties', JSON.stringify(args.properties));

    rangeInput.id = '_Q0_range';
    rangeInput.className = 'a-slider-input';
    rangeInput.type = 'range';

    if (args.minimum) {
        rangeInput.min = args.minimum;
        input.min = args.minimum;
    }
    if (args.maximum) {
        rangeInput.max = args.maximum;
        input.max = args.maximum;
    }

    input.type = 'hidden';
    thumb.className = 'a-label-thumb';
    thumb.setAttribute('for', '_Q0_range');
    preLabel.className = 'a-label-pre';
    postLabel.className = 'a-label-post';
    innerContainer.className = 'o-slider-container';
    outerContainer.style.width = args.width;
    marksContainer.className = 'm-divider-marks';
    marksLabelContainer.className = 'm-label-marks';
    trackContainer.className = 'o-slider-track-wrapper';
    preButton.setAttribute('data-behaviour', 'decrement');
    postButton.setAttribute('data-behaviour', 'increment');

    outerContainer.appendChild(prepostLabel);
    outerContainer.appendChild(preLabel);
    outerContainer.appendChild(preButton);

    track.appendChild(thumb);
    track.appendChild(rangeInput);
    track.appendChild(marksContainer);

    trackContainer.appendChild(track);

    innerContainer.appendChild(trackContainer);
    innerContainer.appendChild(marksLabelContainer);

    outerContainer.appendChild(innerContainer);
    outerContainer.appendChild(input);
    outerContainer.appendChild(postButton);
    outerContainer.appendChild(postLabel);

    return outerContainer;
}

export function OSliderWithExclusive(args): HTMLElement {
    const oResponse: HTMLElement = document.createElement('o-response');
    oResponse.setAttribute('data-properties', JSON.stringify(args));
    const sublist: HTMLElement = document.createElement('o-option-sublist');
    const option: HTMLElement = MOptionBase_Story(args);
    const slider: HTMLElement = OSlider(args);

    oResponse.appendChild(slider);
    sublist.appendChild(option);
    oResponse.appendChild(sublist);

    return oResponse;
}
