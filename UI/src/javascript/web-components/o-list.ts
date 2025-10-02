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

export default class OList extends Component implements Observer {
    public properties: CustomProperties = {
        exact: true,
        jumptofirstletter: false,
        listsize: 6,
        mincharactersforlist: 0,
        notenoughcharacters: 'Keep typing...',
        noitemsinlist: 'No matching entries',
    };

    public mouseEvent = false;

    private element: HTMLInputElement | null = null;
    private listElement: HTMLElement | null = null;
    private listPosition = -1;
    private control: OCombobox | ODropdown | null = null;
    private list: Array<HTMLLIElement> = [];
    private keyBuffer = '';
    private keyTimer: ReturnType<typeof setTimeout>;
    private keyBufferTimeout = 500;

    constructor() {
        super();

        this.keyTimer = setTimeout(() => {
            this.clearKeyBuffer();
        }, this.keyBufferTimeout);
    }

    public update(method: string, data: CustomEvent | Event): void {
        switch (method) {
            case 'filter':
                this.processFilter(<CustomEvent>data);
                break;
            case 'keypress':
                this.handleEvent(<Event>data);
                break;
            case 'clearValue':
                this.clearValue();
                break;
            case 'newValue':
                this.filterList(<CustomEvent>data);
                break;
        }
    }

    private clearValue(): void {
        this.clearSelectedOptions();
        this.clearElementValue();
        this.clearLabel();
    }

    private clearElementValue(): void {
        if (!this.element || !this.element.value.length) return;

        this.element.value = '';
        this.broadcastChange();
    }

    private buildList(): void {
        this.list = Array.from(this.querySelectorAll('li'));
    }

    private buildVisibleList(): Array<HTMLLIElement> {
        return Array.from(
            this.querySelectorAll(
                'li:not(.hidden-filter):not([class^="a-list-placeholder-"])',
            ),
        );
    }

    private indexList(): void {
        this.list.forEach((node, index) => {
            node.dataset.position = `${index}`;
        });
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'keydown':
                this.handleKey(<KeyboardEvent>e);
                break;
            case 'mousedown':
                this.onClick(e);
                break;
            case 'mouseover':
                this.clearHighlightedOption();
                break;
        }
    }

    private handleKey(e: KeyboardEvent): void {
        this.mouseEvent = false;
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
        this.clearHighlightedOption();
        this.listPosition = 0;
        this.setHighlightedOption();
        this.updateScrollPosition();
    }

    private navigateLast(): void {
        this.clearHighlightedOption();
        this.listPosition = this.list.length - 1;
        this.setHighlightedOption();
        this.updateScrollPosition();
    }

    private navigateUp(): void {
        if (this.listPosition === 0) return;

        this.clearHighlightedOption();

        if (this.listPosition === -1) {
            this.listPosition = 0;
        } else {
            this.listPosition--;
        }

        this.setHighlightedOption();
        this.updateScrollPosition();
    }

    private navigateDown(): void {
        const lastPosition = this.list.length - 1;

        if (this.listPosition === lastPosition) return;
        this.clearHighlightedOption();

        if (this.listPosition === -1) {
            this.listPosition = 0;
        } else {
            this.listPosition++;
        }

        this.setHighlightedOption();
        this.updateScrollPosition();
    }

    private updateScrollPosition(skipVisibilityCheck = false): void {
        if (
            !skipVisibilityCheck &&
            !this.checkVisibility({ opacityProperty: true })
        )
            return;

        const currentItem = this.querySelector('.highlight');
        if (!currentItem) return;

        currentItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    private jumpToLetter(input: string): void {
        if (!input.length) {
            return;
        }

        let listPasses = 0;
        let firstLetter: string;
        const list = this.buildVisibleList();
        const highlightEl = this.querySelector('.highlight') as HTMLElement;
        const highlightId = highlightEl?.dataset.position ?? '-1';
        const highlightPos = parseInt(highlightId);

        if (highlightPos > -1) {
            firstLetter =
                highlightEl.textContent?.substring(0, 1).toLowerCase() || '';
        } else {
            firstLetter =
                list[this.listPosition]?.textContent
                    ?.substring(0, 1)
                    .toLowerCase() || '';
        }

        const startPos = Math.max(0, this.listPosition, highlightPos);

        for (let i = startPos; i < list.length; i++) {
            const currentItem = list[i];
            const currentItemLabel = currentItem.innerText.toLowerCase();

            if (currentItemLabel.indexOf(input) === 0) {
                if (
                    (listPasses === 0 &&
                        firstLetter === input.substring(0, 1) &&
                        i < this.listPosition) ||
                    (currentItem.classList.contains('highlight') &&
                        input.length === 1)
                ) {
                    // this is required if we've reached the end of the list and landed on an active item
                    // as the last element -- we will need to loop back for another pass at this point
                    if (listPasses === 0 && i === list.length - 1) {
                        listPasses = 1;
                        i = -1;
                    }
                    continue;
                } else {
                    this.listPosition = i;
                    this.clearHighlightedOption();
                    this.setHighlightedOption();
                    this.updateScrollPosition();
                    return;
                }
            }

            // this is required to reiterate the list for a second time in case we started part way
            // through with an existing selection
            if (listPasses === 0 && i === list.length - 1) {
                listPasses = 1;
                i = 0;
            }
        }
    }

    private filterList(e: CustomEvent): void {
        if (!this.listElement) return;

        // temporarily remove the list from the DOM to improve performance
        const droplistParentNode = this.listElement.parentNode;
        if (!droplistParentNode) return;
        droplistParentNode.removeChild(this.listElement);

        this.clearSelectedOptions();

        let visibleItems = this.list.length;
        const userInput = e.detail.element.value.toLowerCase();

        if (userInput.length < this.properties.mincharactersforlist) {
            this.clearSelectedOptions();
            this.displayEmptyMessage(false);
            this.displayMinCharacterMessage(true);
            return;
        } else {
            this.displayMinCharacterMessage(false);
        }

        this.list.forEach((node) => {
            const itemLabel = node.innerText.toLowerCase();

            if (this.properties.filtertype === 'starts') {
                if (itemLabel.indexOf(userInput) === 0) {
                    node.classList.remove('hidden-filter');
                } else {
                    node.classList.add('hidden-filter');
                    visibleItems--;
                }
            }

            if (this.properties.filtertype === 'contains') {
                if (itemLabel.indexOf(userInput) !== -1) {
                    node.classList.remove('hidden-filter');
                } else {
                    node.classList.add('hidden-filter');
                    visibleItems--;
                }
            }

            if (itemLabel === userInput && this.properties.exact) {
                this.listPosition = parseInt(node.dataset.position ?? '0');
                this.setSelectedOptionByIndex();
            }
        });

        if (visibleItems === 0) {
            this.displayEmptyMessage(true);
        } else {
            this.displayEmptyMessage(false);
        }

        droplistParentNode.appendChild(this.listElement);
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

    private createNotEnoughCharactersMessage(): void {
        if (!this.listElement) return;
        const placeholderElement = document.createElement('li');
        placeholderElement.classList.add('a-list-placeholder-restriction');
        placeholderElement.innerHTML = this.properties.notenoughcharacters;
        this.listElement.appendChild(placeholderElement);
    }

    private createNoItemsInListMessage(): void {
        if (!this.listElement) return;
        const placeholderElement = document.createElement('li');
        placeholderElement.classList.add('a-list-placeholder-empty');
        placeholderElement.innerHTML = this.properties.noitemsinlist;
        this.listElement.appendChild(placeholderElement);
    }

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        this.mouseEvent = true;
        const clickedElement = <HTMLElement>e.target;
        const listItem = clickedElement.closest('li');

        if (!listItem) {
            return;
        }

        if (listItem.dataset.selected === 'true') {
            this.setLabel(listItem);
            this.clearFilteredOptions();
            return;
        }

        this.clearSelectedOptions();
        this.setOption(listItem);
        this.setValue(listItem);
        this.setLabel(listItem);
        this.clearFilteredOptions();
    }

    private restoreSelection(): void {
        if (!this.element) return;

        const listItem =
            <HTMLElement>(
                this.querySelector('[data-value="' + this.element.value + '"]')
            ) ?? <HTMLElement>this.querySelector('[data-selected="true"]');

        if (listItem === null) {
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

    private clearFilteredOptions(): void {
        const filteredOptions = <NodeListOf<HTMLElement>>(
            this.querySelectorAll('.hidden-filter')
        );

        filteredOptions.forEach((option) => {
            option.classList.remove('hidden-filter');
        });

        this.updateScrollPosition();
    }

    private clearSelectedOptions(): void {
        const selectedOptions = <NodeListOf<HTMLElement>>(
            this.querySelectorAll('[data-selected="true"]')
        );

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
        this.listPosition = parseInt(optionPosition);
        option.dataset.selected = 'true';
        option.ariaSelected = 'true';
        this.updateScrollPosition();
    }

    private clearHighlightedOption(): void {
        const currentHighlightedOption = this.querySelector('.highlight');
        if (!currentHighlightedOption) return;
        currentHighlightedOption.classList.remove('highlight');
    }

    private setHighlightedOption(): void {
        const listItem = this.list[this.listPosition];
        if (!listItem) return;
        listItem.classList.add('highlight');
    }

    private setSelectedOptionByIndex(): void {
        this.clearSelectedOptions();
        this.clearHighlightedOption();

        const currentVisibleList = this.buildVisibleList();
        const listItem = currentVisibleList[this.listPosition];

        if (typeof listItem === 'undefined') {
            return;
        }

        this.setOption(listItem);
        this.setValue(listItem);
        this.setLabel(listItem);
        this.clearFilteredOptions();
    }

    private setValue(option: HTMLElement): void {
        if (!this.element || this.element.value === option.dataset.value)
            return;

        this.element.value = `${option.dataset.value}`;
        this.broadcastChange();
    }

    private clearLabel(): void {
        this.dataset.label = '';
        this.broadcastLabelChange();
    }

    private setLabel(option: HTMLElement): void {
        this.dataset.label = `${option.innerText}`;
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
        const matchingElement = <HTMLElement>(
            this.querySelector(
                `[data-value="${e.detail.element.value}"]:not(.hidden-filter)`,
            )
        );

        // the incoming value has been found in the exclusion list
        if (
            e.detail.element.value &&
            this.properties.filter &&
            this.properties.filter.exclusions.indexOf(e.detail.element.value) >=
                0
        ) {
            excluded = true;
        }

        if (matchingElement === null || excluded) {
            this.showOption(null, 'filter');
        } else {
            this.clearFilteredOptions();
            this.hideOption(matchingElement, 'filter');
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
        const list = this.querySelector('ul');
        const lineHeight = 31;
        const padding = 8;

        if (list) {
            list.style.maxHeight = `${padding * 2 + lineHeight * this.properties.listsize}px`;
        }
    }

    private setFilterMethod(): void {
        if (!this.properties.jumptofirstletter) return;
        this.properties.filtertype = 'jump';
    }

    private removeTabIndex(): void {
        this.tabIndex = -1;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.element = this.querySelector('input');
        this.listElement = this.querySelector('ul');
        this.buildList();
        this.indexList();
        this.setListHeight(); // setListHeight must precede restoreSelection to ensure a pre-selected item is correctly scrolled into view
        this.restoreSelection();
        this.setFilterMethod();
        this.createNotEnoughCharactersMessage();
        this.createNoItemsInListMessage();

        this.addEventListener('mousedown', this.handleEvent);
        this.addEventListener('mouseover', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
        this.addEventListener('keyup', this.handleEvent);

        if (this.response) this.response.addObserver(this);

        this.control = this.closest('o-dropdown, o-combobox');
        if (this.control) {
            this.control.addObserver(this);
            this.removeTabIndex();
        }
    }
}
