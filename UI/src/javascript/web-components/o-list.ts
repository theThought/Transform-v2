import Component from './component';
import OCombobox from './o-combobox';
import ODropdown from './o-dropdown';
import { Observer } from '../interfaces';

interface CustomProperties {
    exact: boolean;
    filter?: {
        source: string;
        exclusions: Array<string>;
    };
    filtertype?: string;
    jumptofirstletter: boolean;
    listsize: number;
    mincharactersforlist: number;
    notenoughcharacters: string;
    noitemsinlist: string;
}

interface Overflow {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
    any: boolean;
}

export default class OList extends Component implements Observer {
    public properties: CustomProperties = {
        exact: true,
        jumptofirstletter: false,
        listsize: 6,
        mincharactersforlist: 0,
        notenoughcharacters: 'Keep typing...',
        noitemsinlist: 'No matching entries',
    };

    protected element: HTMLInputElement | null = null;
    private listElement: HTMLElement | null = null;
    private listHighlightedIndex = -1;
    private listSelectedIndex = -1;
    private control: OCombobox | ODropdown | null = null;
    private list: Array<HTMLLIElement> = [];
    private visibleList: Array<HTMLLIElement> = [];
    private keyBuffer = '';
    private keyTimer: ReturnType<typeof setTimeout>;
    private keyBufferTimeout = 500;
    private containerScrollLeft = 0;
    private containerScrollTop = 0;
    private documentScrollLeft = 0;
    private documentScrollTop = 0;
    private controlHeight = 38;
    private height = 0;
    private initialHeight = 0;
    private isConfigured = false;

    constructor() {
        super();

        this.keyTimer = setTimeout(() => {
            this.clearKeyBuffer();
        }, this.keyBufferTimeout);

        this.setListElement();
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.oneTimeConfiguration();
        this.restoreSelection();
        this.updateScrollPosition();

        this.addEventListener('mousedown', this.handleEvent);
        this.addEventListener('mouseleave', this.handleEvent);
        this.addEventListener('mouseover', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
        this.addEventListener('keyup', this.handleEvent);
        this.addEventListener('restore', this.handleEvent);
        document.addEventListener('scroll', this);

        if (this.response) this.response.addObserver(this);

        this.control = this.closest('o-dropdown, o-combobox');

        if (this.control) {
            this.addVisibilityObserver();
            this.control.addObserver(this);
            this.removeTabIndex();
        }
    }

    public disconnectedCallback(): void {
        this.removeEventListener('mousedown', this.handleEvent);
        this.removeEventListener('mouseleave', this.handleEvent);
        this.removeEventListener('mouseover', this.handleEvent);
        this.removeEventListener('keydown', this.handleEvent);
        this.removeEventListener('keyup', this.handleEvent);
        this.removeEventListener('restore', this.handleEvent);
        document.removeEventListener('scroll', this);

        if (this.response) this.response.removeObserver(this);
        if (this.control) this.control.removeObserver(this);
    }

    private oneTimeConfiguration(): void {
        if (this.isConfigured) return;

        this.buildList();
        this.buildVisibleList();
        this.setListHeight();

        this.createNotEnoughCharactersMessage();
        this.createNoItemsInListMessage();
        this.initialMinCharacterMessage();
        this.setFilterMethod();
        this.isConfigured = true;
    }

    public update(method: string, data: CustomEvent | Event): void {
        switch (method) {
            case 'keypress':
                this.handleEvent(data);
                break;
            case 'clearValue':
                this.clearValue(data as CustomEvent);
                break;
            case 'newValue':
                this.filterList(data as CustomEvent);
                break;
            case 'optionVisibilityChange':
                this.processFilter(data as CustomEvent);
                break;
            case 'hidden':
                this.clearHighlightedOption();
                this.updateScrollPosition();
                break;
            case 'widthChange':
                this.newWidthFromControl(<CustomEvent>data);
                break;
        }
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'keydown':
                this.handleKey(e as KeyboardEvent);
                break;
            case 'mousedown':
                this.onClick(e);
                break;
            case 'mouseover':
                this.setHighlightedOptionFromMouse(e);
                break;
            case 'mouseleave':
                this.resetHighlightedOption();
                break;
            case 'restore':
                this.restoreClearedValue();
                break;
            case 'scroll':
                this.updatePosition(e.target as HTMLElement);
                break;
        }
    }

    private newWidthFromControl(e: CustomEvent): void {
        this.style.maxWidth = parseInt(e.detail) + 'px';
    }

    private clearValue(e: CustomEvent): void {
        if (this.qgroup != e.detail?.qgroup) return;

        this.clearSelectedOptions();
        this.clearElementValue();
        this.clearLabel();
    }

    private clearValueFromLocal(): void {
        this.clearSelectedOptions();
        this.clearElementValue();
    }

    private clearElementValue(): void {
        if (!this.element || !this.element.value.length) return;

        this.element.placeholder = this.element.value;
        this.element.value = '';
        this.broadcastChange();
    }

    private buildList(): void {
        this.list = Array.from(
            this.querySelectorAll('li:not([class^="a-list-placeholder-"])'),
        );
        this.indexList();
    }

    private buildVisibleList(): void {
        this.visibleList = Array.from(
            this.querySelectorAll(
                'li:not(.hidden-filter):not(.hidden-rule):not([class^="a-list-placeholder-"])',
            ),
        );
        this.indexVisibleList();
    }

    private indexList(): void {
        this.list.forEach((node, index) => {
            node.dataset.position = `${index}`;
            node.dataset.visiblePosition = `${index}`;
        });
    }

    private indexVisibleList(): void {
        this.list.forEach((node) => {
            node.dataset.visiblePosition = ``;
        });
        this.visibleList.forEach((node, index) => {
            node.dataset.visiblePosition = `${index}`;
        });
    }

    private updatePosition(target: HTMLElement | Document): void {
        // Do not update position if it is the list that is being scrolled
        if (target === this) return;

        // Do not update position if list is not a child of scroll target
        if (!target.contains(this)) return;

        // Do not update position if there is no parent control to align with
        if (!this.control) return;

        let scrollLeft;
        let scrollTop;

        if (
            target instanceof HTMLElement &&
            typeof target.scrollLeft !== 'undefined'
        ) {
            scrollLeft = target.scrollLeft;
            if (scrollLeft !== this.containerScrollLeft) {
                this.containerScrollLeft = scrollLeft;
                this.style.marginLeft = 0 - scrollLeft + 'px';
                return;
            }
        } else {
            scrollLeft =
                document.documentElement.scrollLeft || document.body.scrollLeft;
            if (scrollLeft !== this.documentScrollLeft) {
                this.documentScrollLeft = scrollLeft;
                this.style.marginLeft = 0 - scrollLeft + 'px';
                return;
            }
        }

        if (
            target instanceof HTMLElement &&
            typeof target.scrollTop !== 'undefined'
        ) {
            scrollTop = target.scrollTop;

            if (this.classList.contains('direction-up')) {
                scrollTop += this.height - 2 + this.controlHeight;
            }

            if (scrollTop !== this.containerScrollTop) {
                this.containerScrollTop = scrollTop;
                this.style.marginTop = 0 - 2 - scrollTop + 'px';
            }
        } else {
            scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;

            if (this.classList.contains('direction-up')) {
                scrollTop += this.height - 2 + this.controlHeight;
            }

            if (scrollTop !== this.documentScrollTop) {
                this.documentScrollTop = scrollTop;
                this.style.marginTop = 0 - 2 - scrollTop + 'px';
            }
        }
    }

    private handleKey(e: KeyboardEvent): void {
        if (this.isReadonly) return;
        if (!this.checkVisibility({ opacityProperty: true })) return;

        e.stopPropagation();

        switch (e.key) {
            case 'ArrowUp':
                this.clearKeyBuffer();
                this.navigateUp();
                break;
            case 'ArrowDown':
                this.clearKeyBuffer();
                this.navigateDown();
                break;
            case 'Home':
                this.navigateFirst();
                break;
            case 'End':
                this.navigateLast();
                break;
            case 'Enter':
                this.setSelectedOptionByIndex();
                break;
            case 'Tab':
            case 'Escape':
                break;
            default:
                this.keyBuffer += e.key.toLowerCase();
                this.extendKeyBufferTimer();
                this.jumpToLetter(this.keyBuffer);
                break;
        }
    }

    private clearKeyBuffer(): void {
        this.keyBuffer = '';
    }

    private extendKeyBufferTimer(): void {
        clearInterval(this.keyTimer);

        this.keyTimer = setTimeout(() => {
            this.clearKeyBuffer();
        }, this.keyBufferTimeout);
    }

    private navigateFirst(): void {
        if (!this.visibleList.length) return;

        const firstVisibleItem = this.visibleList[0];
        this.setHighlightedOption(firstVisibleItem);
        this.updateScrollPosition();
    }

    private navigateLast(): void {
        if (!this.visibleList.length) return;

        const lastVisibleItem = this.visibleList[this.visibleList.length - 1];
        this.setHighlightedOption(lastVisibleItem);
        this.updateScrollPosition();
    }

    private navigateUp(): void {
        if (this.listHighlightedIndex === 0) return;
        if (!this.visibleList.length) return;

        if (this.listHighlightedIndex === -1) {
            this.navigateLast();
        } else {
            const previousVisibleItem =
                this.visibleList[this.listHighlightedIndex - 1];
            this.setHighlightedOption(previousVisibleItem);
            this.updateScrollPosition();
        }
    }

    private navigateDown(): void {
        if (this.listHighlightedIndex === this.visibleList.length - 1) return;
        if (!this.visibleList.length) return;

        if (this.listHighlightedIndex === -1) {
            this.navigateFirst();
        } else {
            const nextVisibleItem =
                this.visibleList[this.listHighlightedIndex + 1];
            this.setHighlightedOption(nextVisibleItem);
            this.updateScrollPosition();
        }
    }

    private updateScrollPosition(): void {
        const currentItem =
            this.querySelector('.highlight') ??
            this.querySelector('[data-selected]');
        if (!currentItem) return;

        currentItem.scrollIntoView({ block: 'center', inline: 'nearest' });
    }

    private resetScrollPosition(): void {
        const currentPosition =
            this.listSelectedIndex > 0 ? this.listSelectedIndex : 0;
        const currentItem = this.visibleList[currentPosition];
        if (!currentItem) return;

        currentItem.scrollIntoView({ block: 'start' });
    }

    private jumpToLetter(input: string): void {
        if (!input.length) {
            return;
        }

        let listPasses = 0;
        let firstLetter: string;
        const highlightEl = this.querySelector('.highlight') as HTMLElement;
        const highlightId = highlightEl?.dataset.position ?? '-1';
        const highlightPos = Number(highlightId);

        if (highlightPos > -1) {
            firstLetter =
                highlightEl.textContent?.substring(0, 1).toLowerCase() || '';
        } else {
            firstLetter =
                this.visibleList[this.listSelectedIndex]?.textContent
                    ?.substring(0, 1)
                    .toLowerCase() || '';
        }

        const startPos = Math.max(0, this.listSelectedIndex, highlightPos);

        for (let i = startPos; i < this.visibleList.length; i++) {
            const currentItem = this.visibleList[i];
            const currentItemLabel = currentItem.innerText.toLowerCase();

            if (currentItemLabel.indexOf(input) === 0) {
                if (
                    (listPasses === 0 &&
                        firstLetter === input.substring(0, 1) &&
                        i < this.listSelectedIndex) ||
                    (currentItem.classList.contains('highlight') &&
                        input.length === 1)
                ) {
                    // this is required if we've reached the end of the list and landed on an active item
                    // as the last element -- we will need to loop back for another pass at this point
                    if (listPasses === 0 && i === this.visibleList.length - 1) {
                        listPasses = 1;
                        i = -1;
                    }
                    continue;
                } else {
                    this.listSelectedIndex = i;
                    this.setHighlightedOption(currentItem);
                    this.updateScrollPosition();
                    return;
                }
            }

            // this is required to reiterate the list for a second time in case we started part way
            // through with an existing selection
            if (listPasses === 0 && i === this.visibleList.length - 1) {
                listPasses = 1;
                i = -1;
            }
        }
    }

    private initialMinCharacterMessage(): void {
        if (this.properties.mincharactersforlist > 0) {
            this.displayMinCharacterMessage(true);
        }
    }

    private filterList(e: CustomEvent): void {
        if (!this.listElement) return;

        const droplistParentNode = this.listElement.parentNode;
        if (!droplistParentNode) return;

        const userInput = e.detail.element.value.toLowerCase();

        const displayMinCharacterMessage =
            userInput.length < this.properties.mincharactersforlist;

        if (userInput.length === 0) {
            this.displayEmptyMessage(false);
            this.displayMinCharacterMessage(displayMinCharacterMessage);
            this.clearValue(e);
            this.clearFilteredOptions();
            this.clearHighlightedOption();
            this.buildVisibleList();
            this.setDropListDirection();
            this.resetScrollPosition();
            return;
        }

        if (userInput.length < this.properties.mincharactersforlist) {
            this.displayEmptyMessage(false);
            this.displayMinCharacterMessage(true);
            this.clearElementValue();
            this.setDropListDirection();
            this.clearHighlightedOption();
            this.updateScrollPosition();
            return;
        } else {
            this.displayMinCharacterMessage(false);
        }

        for (const currentItem of this.list) {
            const itemLabelWrapper =
                currentItem.getElementsByClassName('a-label-option')[0];
            const itemLabel = itemLabelWrapper.textContent?.toLowerCase() ?? '';

            if (this.properties.filtertype === 'starts') {
                if (itemLabel.indexOf(userInput) === 0) {
                    currentItem.classList.remove('hidden-filter');
                } else {
                    currentItem.classList.add('hidden-filter');
                }
            }

            if (this.properties.filtertype === 'contains') {
                if (itemLabel.indexOf(userInput) !== -1) {
                    currentItem.classList.remove('hidden-filter');
                } else {
                    currentItem.classList.add('hidden-filter');
                }
            }

            if (this.properties.exact) {
                if (itemLabel === userInput) {
                    this.listSelectedIndex = Number(
                        currentItem.dataset.position ?? '0',
                    );
                    this.displayEmptyMessage(false);
                    this.setHighlightedOption(currentItem);
                    this.setSelectedOptionByIndex();
                    return;
                } else if (this.element?.value) {
                    this.clearHighlightedOption();
                    this.updateScrollPosition();
                    this.clearValueFromLocal();
                }
            }
        }

        this.buildVisibleList();

        if (this.visibleList.length) {
            this.displayEmptyMessage(false);
            this.clearHighlightedOption();
            this.navigateFirst();
        } else {
            this.clearHighlightedOption();
            this.resetScrollPosition();
            this.displayEmptyMessage(true);
        }

        this.setDropListDirection();
    }

    private createNotEnoughCharactersMessage(): void {
        this.addListEntry(
            'a-list-placeholder-restriction',
            this.properties.notenoughcharacters,
        );
    }

    private createNoItemsInListMessage(): void {
        this.addListEntry(
            'a-list-placeholder-empty',
            this.properties.noitemsinlist,
        );
    }

    private displayEmptyMessage(visibility: boolean): void {
        if (visibility) {
            this.classList.add('empty');
        } else {
            this.classList.remove('empty');
        }
    }

    private displayMinCharacterMessage(visibility: boolean): void {
        if (visibility) {
            this.classList.add('char-restriction');
        } else {
            this.classList.remove('char-restriction');
        }
    }

    private addListEntry(className: string, content: string): void {
        if (!this.listElement) return;
        const newEntry = document.createElement('li');
        newEntry.classList.add(className);
        newEntry.classList.add('m-list-option');

        const newEntryContent = document.createElement('div');
        newEntryContent.innerHTML = content;

        newEntry.appendChild(newEntryContent);
        this.listElement.appendChild(newEntry);
    }

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        const clickedElement = e.target as HTMLElement;
        const listItem = clickedElement.closest('li');

        if (!listItem) {
            return;
        }

        this.setSelectedOption(listItem);
    }

    private setSelectedOptionByIndex(): void {
        const listItem = this.visibleList[this.listHighlightedIndex];

        if (listItem?.dataset.readonly === 'true') {
            return;
        }

        if (typeof listItem === 'undefined') {
            return;
        }

        this.setSelectedOption(listItem);
        this.updateScrollPosition();
    }

    private setSelectedOption(option: HTMLLIElement): void {
        this.clearSelectedOptions();
        this.setOption(option);
        this.setValue(option);
        this.clearFilteredOptions();
    }

    protected restoreSelection(): void {
        if (!this.element) return;

        const listItem =
            (this.querySelector(
                '[data-value="' + this.element.value + '"]',
            ) as HTMLElement) ??
            (this.querySelector('[data-selected="true"]') as HTMLElement);

        if (listItem === null) {
            this.clearSelectedOptions();
            return;
        }

        // clearSelectedOptions is called to handle an edge case that should not
        // be experienced in production: where the list is supplied with a selected
        // entry AND a value is supplied in the hidden input field
        this.clearSelectedOptions();

        this.setOption(listItem);
        this.setValue(listItem);
        this.setLabel(listItem);
    }

    protected restoreClearedValue(): void {
        if (!this.element) return;
        this.restoreSelection();
    }

    private clearFilteredOptions(): void {
        const filteredOptions = this.querySelectorAll(
            '.hidden-filter',
        ) as NodeListOf<HTMLElement>;

        filteredOptions.forEach((option) => {
            option.classList.remove('hidden-filter');
        });

        this.buildVisibleList();
    }

    private clearSelectedOptions(): void {
        this.listSelectedIndex = -1;
        const selectedOptions = this.querySelectorAll(
            '[data-selected="true"]',
        ) as NodeListOf<HTMLElement>;

        selectedOptions.forEach((option) => {
            this.clearOption(option);
        });
    }

    private clearOption(option: HTMLElement): void {
        option.dataset.selected = 'false';
        option.ariaSelected = 'false';
    }

    private setOption(option: HTMLElement): void {
        const optionPosition = option.dataset.position ?? '0';
        this.listSelectedIndex = Number(optionPosition);
        option.dataset.selected = 'true';
        option.ariaSelected = 'true';
    }

    private setHighlightedOptionFromMouse(e: Event): void {
        const target = e.target as HTMLLIElement;
        if (!target?.dataset.position) return;

        this.setHighlightedOption(target);
    }

    private setHighlightedOption(option: HTMLLIElement): void {
        this.visibleList[this.listSelectedIndex]?.classList.remove('highlight');
        this.visibleList[this.listHighlightedIndex]?.classList.remove(
            'highlight',
        );
        option.classList.add('highlight');
        this.listHighlightedIndex = Number(option.dataset.visiblePosition);
    }

    private clearHighlightedOption(): void {
        const currentHighlightedOption = this.querySelector('.highlight');
        if (!currentHighlightedOption) return;
        this.listHighlightedIndex = -1;

        currentHighlightedOption.classList.remove('highlight');
    }

    private resetHighlightedOption(): void {
        if (this.listSelectedIndex === -1) {
            this.clearHighlightedOption();
            return;
        }
        this.setHighlightedOption(this.list[this.listSelectedIndex]);
    }

    private setValue(option: HTMLElement): void {
        if (!this.element) return;
        if (this.element.value === option.dataset.value) {
            this.sendClickEvent();
            return;
        }

        this.element.value = `${option.dataset.value}`;
        this.element.placeholder = '';
        this.broadcastChange();
    }

    private clearLabel(): void {
        this.dataset.label = '';
        this.broadcastLabelChange();
    }

    private sendClickEvent(): void {
        const clickEvent = new CustomEvent('clickEvent', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(clickEvent);
    }

    private setLabel(option: HTMLElement): void {
        // retrieve the string using textContent - do not use innerText
        // as this will not retrieve values from items that are hidden
        let label = option.textContent;

        // parse out certain non-printing characters that have been observed
        label = label.replace(/\s\s+/g, ' ');

        // trim leading/trailing spaces
        label = label.trim();

        // store the cleaned label to the data-label property
        this.dataset.label = label;

        // inform a combobox/droplist that a label change needs to occur
        this.broadcastLabelChange();
    }

    private broadcastLabelChange(): void {
        const labelChange = new CustomEvent('labelChange', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(labelChange);
    }

    private processFilter(e: CustomEvent): void {
        let excluded = false;
        const matchingElement = this.querySelector(
            `[data-value="${e.detail.element.dataset.value}"]:not(.hidden-filter)`,
        ) as HTMLElement;

        // the incoming value has been found in the exclusion list
        if (
            e.detail.element.dataset.value &&
            this.properties.filter &&
            this.properties.filter.exclusions.indexOf(
                e.detail.element.dataset.value,
            ) >= 0
        ) {
            excluded = true;
        }

        if (matchingElement === null || excluded) {
            this.showOption(null, e.detail.hideMethod);
        } else {
            if (e.detail.visibility === 'visible') {
                this.showOption(
                    e.detail.element.dataset.value,
                    e.detail.hideMethod,
                );
            } else {
                this.clearFilteredOptions();
                this.hideOption(matchingElement, e.detail.hideMethod);
                this.buildVisibleList();
            }
        }
    }

    private hideOption(option: HTMLElement, hideMethod: string): void {
        if (option.dataset.selected === 'true') {
            this.clearOption(option);
            this.clearElementValue();
            this.clearLabel();
        }

        if (hideMethod === 'filter') {
            option.classList.add('hidden-filter');
        } else {
            option.classList.add('hidden-rule');
        }
    }

    private showOption(itemValue: string | null, hideMethod: string): void {
        let option;

        if (itemValue === null) {
            option = this.querySelector('.hidden-filter');
        } else {
            option = this.querySelector(
                "[value='" + itemValue + "'], [data-value='" + itemValue + "']",
            );
        }

        if (option === null) {
            return;
        }

        if (hideMethod === 'filter') {
            option.classList.remove('hidden-filter');
        } else {
            option.classList.remove('hidden-rule');
        }
    }

    private setListHeight(): void {
        if (!this.listElement) return;

        const lineHeight = 33;
        const padding = 8;

        this.initialHeight =
            padding * 2 + lineHeight * this.properties.listsize;
        this.listElement.style.maxHeight = `${this.initialHeight}px`;
    }

    private setFilterMethod(): void {
        if (!this.properties.jumptofirstletter) return;
        this.properties.filtertype = 'jump';
    }

    private removeTabIndex(): void {
        this.tabIndex = -1;
    }

    private setListElement(): void {
        this.listElement = this.querySelector('ul');
    }

    private checkViewportBounds(element: HTMLElement): Overflow {
        const bounding = element.getBoundingClientRect();
        const overflow: Overflow = { any: false };

        overflow.top = bounding.top < 0;
        overflow.left = bounding.left < 0;
        overflow.bottom =
            bounding.bottom >
            (window.innerHeight || document.documentElement.clientHeight);
        overflow.right =
            bounding.right >
            (window.innerWidth || document.documentElement.clientWidth);
        overflow.any =
            overflow.top || overflow.left || overflow.bottom || overflow.right;

        return overflow;
    }

    private setDropListDirection(): void {
        if (!this.listElement) return;

        // reset to the default direction before performing overflow checks
        if (this.classList.contains('direction-up')) {
            this.classList.remove('direction-up');
        }

        this.updatePosition(document);

        if (this.listElement.getBoundingClientRect().height > 0) {
            this.listElement.style.maxHeight = `${this.initialHeight}px`;
            this.height = this.listElement.getBoundingClientRect().height;
        }

        const viewportBounds = this.checkViewportBounds(this.listElement);
        const distanceToTop =
            this.listElement.getBoundingClientRect().top - this.controlHeight;
        const distanceToBottom =
            window.innerHeight - this.listElement.getBoundingClientRect().top;

        if (viewportBounds.bottom) {
            if (distanceToBottom < distanceToTop) {
                // there's more space available above the item, appear above
                if (!this.classList.contains('direction-up')) {
                    this.classList.add('direction-up');
                }
                if (
                    this.listElement.getBoundingClientRect().height >
                    distanceToTop - this.controlHeight
                ) {
                    this.height = distanceToTop;
                    this.listElement.style.maxHeight = `${distanceToTop}px`;
                }
            } else {
                // there's more space available below the item, appear below
                if (
                    this.listElement.getBoundingClientRect().height >
                    distanceToBottom
                ) {
                    this.height = distanceToBottom;
                    this.listElement.style.maxHeight = `${distanceToBottom}px`;
                }
            }
        }

        this.updatePosition(document);
    }

    private addVisibilityObserver(): void {
        if (!this.control) return;

        // Options for the observer (which mutations to observe)
        const config = {
            attributeFilter: ['style', 'class'],
        };

        const mutationObserver = (): void => {
            if (
                this.checkVisibility({
                    opacityProperty: true,
                    visibilityProperty: true,
                })
            ) {
                if (this.element?.value) {
                    this.resetHighlightedOption();
                    this.updateScrollPosition();
                }
            } else {
                this.clearHighlightedOption();
                this.resetScrollPosition();
            }
            this.setDropListDirection();
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(mutationObserver);

        // Start observing the target node for configured mutations
        observer.observe(this.control, config);
    }
}
