// DEMO web component for Storybook introduction.
import WCExample from './web-components/wc-example';

// Survey web components.
import OQuestion from './web-components/o-question';
import OQuestionContainer from './web-components/o-question-container';
import OQuestionResponse from './web-components/o-question-response';

import MInputSinglelineedit from './web-components/m-input-singlelineedit';
import OCombobox from './web-components/o-combobox';
import ODropdown from './web-components/o-dropdown';

export const uiInit = (): void => {
    // DEMO web component for Storybook introduction.
    !customElements.get('wc-example') &&
        customElements.define('wc-example', WCExample);

    // Survey web components.
    !customElements.get('o-question') &&
        customElements.define('o-question', OQuestion);
    !customElements.get('o-question-container') &&
        customElements.define('o-question-container', OQuestionContainer);
    !customElements.get('o-question-response') &&
        customElements.define('o-question-response', OQuestionResponse);

    !customElements.get('m-input-singlelineedit') &&
        customElements.define('m-input-singlelineedit', MInputSinglelineedit);
    !customElements.get('o-combobox') &&
        customElements.define('o-combobox', OCombobox);
    !customElements.get('o-dropdown') &&
        customElements.define('o-dropdown', ODropdown);
};
