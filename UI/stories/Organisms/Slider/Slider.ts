import * as MLabel from '../../Molecules/Label/prepost';
import { MOptionBase_Story } from '../../Molecules/Option/base';
import { OSliderTrack } from '../../Molecules/Slider/Slider';

export function OSlider(args): HTMLElement {
    const outerContainer: HTMLElement = document.createElement('o-slider');
    const prepostLabel = MLabel.MLabelPrePost();
    const preLabel = document.createElement('span');
    const postLabel = document.createElement('span');
    const preButton = document.createElement('a-button-terminator');
    const postButton = document.createElement('a-button-terminator');
    const innerContainer = document.createElement('div');
    const track = OSliderTrack(args);

    outerContainer.setAttribute(
        'data-properties',
        JSON.stringify(args.properties),
    );

    preLabel.className = 'a-label-pre';
    postLabel.className = 'a-label-post';
    innerContainer.className = 'o-slider-container';
    outerContainer.style.width = args.width;
    preButton.setAttribute('data-behaviour', 'decrement');
    postButton.setAttribute('data-behaviour', 'increment');

    outerContainer.appendChild(prepostLabel);

    innerContainer.appendChild(preLabel);
    innerContainer.appendChild(preButton);
    innerContainer.appendChild(track);
    innerContainer.appendChild(postButton);
    innerContainer.appendChild(postLabel);

    outerContainer.appendChild(innerContainer);

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
