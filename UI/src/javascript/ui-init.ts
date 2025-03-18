// DEMO web component for Storybook introduction.
import WCExample from './web-components/wc-example';

// Import modules for web components.
import MInputSingleline from './web-components/m-input-singleline';
import MInputSinglelineNumber from './web-components/m-input-singleline-number';
import MOptionBase from './web-components/m-option-base';
import OCombobox from './web-components/o-combobox';
import ODropdown from './web-components/o-dropdown';
import OQuestion from './web-components/o-question';
import OResponse from './web-components/o-response';

export const uiInit = (): void => {
    // DEMO web component for Storybook introduction.
    !customElements.get('wc-example') &&
        customElements.define('wc-example', WCExample);

    // Define custom elements in the client.
    // The order in which these elements are listed below is the order in which
    // the client will initialise the elements. It is therefore important to
    // consider the sequence of define calls: i.e. inputs belong to a response
    // which belongs to a question and may require the question to be present.

    // Outer containers.
    !customElements.get('o-question') &&
        customElements.define('o-question', OQuestion);
    !customElements.get('o-response') &&
        customElements.define('o-response', OResponse);

    // Inner components.
    !customElements.get('m-input-singleline') &&
        customElements.define('m-input-singleline', MInputSingleline);
    !customElements.get('m-input-singleline-number') &&
        customElements.define(
            'm-input-singleline-number',
            MInputSinglelineNumber,
        );
    !customElements.get('m-option-base') &&
        customElements.define('m-option-base', MOptionBase);
    !customElements.get('o-combobox') &&
        customElements.define('o-combobox', OCombobox);
    !customElements.get('o-dropdown') &&
        customElements.define('o-dropdown', ODropdown);
};
