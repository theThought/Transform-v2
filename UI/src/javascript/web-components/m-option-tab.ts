import MOptionBase from './m-option-base';

export default class MOptionTab extends MOptionBase {
    protected onClick(e: Event): void {
        if (this.dataset.checked !== 'true') {
            const form = this.closest('form');
            if (form) form.submit();
        }

        super.onClick(e);
    }
}
