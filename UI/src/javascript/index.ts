// Import CSS.
import '../../src/css/index.css';

// Import key ES modules.
import { browserSupportsAllFeatures } from './utils/browser-supports-features';
import { uiInit } from './ui-init';
import { visible } from './web-components/util';

if (browserSupportsAllFeatures()) {
    uiInit();
} else {
    // Dynamic import polyfills, then instantiate UI modules.
    import('./utils/polyfills')
        .then(() => uiInit())
        .catch((e) => console.error(e));
}

window.addEventListener('pageshow', () => {
    let first;
    let firstOffY;

    const allVisible = Array.from(
        document.querySelectorAll(
            'o-question:not([data-global="true"]) input, o-question:not([data-global="true"]) textarea',
        ) as NodeListOf<HTMLInputElement>,
    ).filter(visible);

    for (const elem of allVisible) {
        const offY =
            elem.getBoundingClientRect().top +
            document.documentElement.scrollTop;
        if (first == null || !firstOffY || offY < firstOffY) {
            first = elem;
            firstOffY = offY;
        }
    }

    first?.focus();
});
