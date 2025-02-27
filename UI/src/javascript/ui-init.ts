// DEMO web component for Storybook introduction.
import WCExample from './web-components/wc-example';

// Survey web components.
import MInputSingleline from './web-components/m-input-singleline';
import MInputSinglelineNumber from './web-components/m-input-singleline-number';
import OCombobox from './web-components/o-combobox';
import ODropdown from './web-components/o-dropdown';
import OQuestion from './web-components/o-question';
import OResponse from './web-components/o-response';

export const uiInit = (): void => {
    // DEMO web component for Storybook introduction.
    !customElements.get('wc-example') &&
        customElements.define('wc-example', WCExample);

    // Survey web components.
    !customElements.get('m-input-singleline') &&
        customElements.define('m-input-singleline', MInputSingleline);
    !customElements.get('m-input-singleline-number') &&
        customElements.define('m-input-singleline-number', MInputSinglelineNumber);
    !customElements.get('o-combobox') &&
        customElements.define('o-combobox', OCombobox);
    !customElements.get('o-dropdown') &&
        customElements.define('o-dropdown', ODropdown);
    !customElements.get('o-question') &&
        customElements.define('o-question', OQuestion);
    !customElements.get('o-response') &&
        customElements.define('o-response', OResponse);
};
