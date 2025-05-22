import MOptionBase from './m-option-base';

export default class MOptionTab extends MOptionBase {
    protected onClick(e: Event): void {
        super.onClick(e);

        const form = this.closest('form');
        if (form) {
            form.submit();
        }
    }
}
