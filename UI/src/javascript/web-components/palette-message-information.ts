import Component from './component';
import OPaletteLoop from './o-palette-loop';

export default class PaletteMessageInformation extends Component {
    private OLoop: OPaletteLoop | null = null;

    private setInteractionStatus(): void {
        if (!this.OLoop) return;
        if (this.OLoop.getRemainingAnswerCount())
            this.classList.add('inactive');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.OLoop = document.querySelector('o-palette-loop');
        this.setInteractionStatus();
    }
}
