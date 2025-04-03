// DEMO web component for Storybook introduction.
import WCExample from './web-components/wc-example';

// Import modules for web components.
import MSingleline from './web-components/m-singleline';
import MSinglelineNumber from './web-components/m-singleline-number';
import MSinglelineDate from './web-components/m-singleline-date';
import MOptionBase from './web-components/m-option-base';
import OCombobox from './web-components/o-combobox';
import ODropdown from './web-components/o-dropdown';
import OOptionSublist from './web-components/o-option-sublist';
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

    !customElements.get('o-option-sublist') &&
        customElements.define('o-option-sublist', OOptionSublist);
    !customElements.get('o-combobox') &&
        customElements.define('o-combobox', OCombobox);
    !customElements.get('o-dropdown') &&
        customElements.define('o-dropdown', ODropdown);

    // Inner components.
    !customElements.get('m-singleline') &&
        customElements.define('m-singleline', MSingleline);
    !customElements.get('m-singleline-number') &&
        customElements.define('m-singleline-number', MSinglelineNumber);
    !customElements.get('m-singleline-date') &&
        customElements.define('m-singleline-date', MSinglelineDate);
    !customElements.get('m-option-base') &&
        customElements.define('m-option-base', MOptionBase);
};
