export function OSliderTrack(args): HTMLElement {
    const track = document.createElement('m-slider-track');
    const rangeInput = document.createElement('input');
    const input = document.createElement('input');
    const marksContainer = document.createElement('div');
    const thumb = document.createElement('output');
    const marksLabelContainer = document.createElement('div');

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
    marksContainer.className = 'm-divider-marks';
    marksLabelContainer.className = 'm-label-marks';

    track.appendChild(thumb);
    track.appendChild(rangeInput);
    track.appendChild(marksContainer);
    track.appendChild(marksLabelContainer);

    return track;
}
