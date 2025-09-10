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
    filtermethod?: string;
    jumptofirstletter: boolean;
    listsize: number;
    mincharactersforlist: number;
}

export default class OList extends Component implements Observer {
    public properties: CustomProperties = {
        exact: true,
        jumptofirstletter: false,
        listsize: 6,
        mincharactersforlist: 0,
    };

    public mouseEvent = false;

    private element: HTMLInputElement | null = null;
    private currentListPosition = -1;
    private control: OCombobox | ODropdown | null = null;
    private list: Array<HTMLLIElement> = [];
    private keyBuffer = '';
    private keyTimer: ReturnType<typeof setTimeout>;
    private keyTimerLimit = 500; // Time in milliseconds at which the buffer is cleared.

    constructor() {
        super();

        this.keyTimer = setTimeout(() => {
            this.clearKeyBuffer();
        }, this.keyTimerLimit);
    }

    public update(method: string, data: CustomEvent | Event): void {
        switch (method) {
            case 'filter':
                this.processFilter(<CustomEvent>data);
                break;
            case 'focusin':
                this.updateScrollPosition(true);
                break;
            case 'keypress':
                this.handleEvent(<Event>data);
                break;
            case 'clearValue':
                this.clearValue();
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
                'li:not(.filter-hidden):not([class^="a-list-placeholder-"])',
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
            case 'click':
                this.onClick(e);
                break;
            case 'keydown':
                this.handleKey(<KeyboardEvent>e);
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
            case 'Tab':
            case 'Enter':
            case 'Escape':
                break;
            default:
                this.keyBuffer += e.key.toLowerCase();
                this.extendKeyBufferTimer();
                this.filterList();
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
        }, this.keyTimerLimit);
    }

    private navigateFirst(): void {
        this.currentListPosition = 0;
        this.setSelectedOptionByIndex();
        this.updateScrollPosition();
    }

    private navigateLast(): void {
        this.currentListPosition = this.list.length - 1;
        this.setSelectedOptionByIndex();
        this.updateScrollPosition();
    }

    private navigateUp(): void {
        if (this.currentListPosition === 0) {
            return;
        }

        if (this.currentListPosition === -1) {
            this.currentListPosition = 0;
        } else {
            this.currentListPosition--;
        }

        this.setSelectedOptionByIndex();
        this.updateScrollPosition();
    }

    private navigateDown(): void {
        const lastPosition = this.list.length - 1;

        if (this.currentListPosition === lastPosition) {
            return;
        }

        if (this.currentListPosition === -1) {
            this.currentListPosition = 0;
        } else {
            this.currentListPosition++;
        }

        this.setSelectedOptionByIndex();
        this.updateScrollPosition();
    }

    private updateScrollPosition(skipVisibilityCheck = false): void {
        if (
            !skipVisibilityCheck &&
            !this.checkVisibility({ opacityProperty: true })
        )
            return;

        const position = this.currentListPosition;
        const currentItem = this.buildVisibleList()[position];

        if (typeof currentItem === 'undefined') {
            return;
        }

        currentItem.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    private filterList(): void {
        switch (this.properties.filtermethod) {
            case 'starts':
                this.filterListStarts(this.keyBuffer);
                break;
            case 'contains':
                this.filterListContains(this.keyBuffer);
                break;
            case 'jump':
                this.jumpToLetter(this.keyBuffer);
        }
    }

    private jumpToLetter(input: string): void {
        if (!input.length) {
            return;
        }

        const list = this.buildVisibleList();
        let currentFirstLetter = '';

        if (this.currentListPosition !== -1) {
            currentFirstLetter = list[this.currentListPosition].textContent
                .substring(0, 1)
                .toLowerCase();
        }

        let listPasses = 0;

        for (let i = 0; i < list.length; i++) {
            const currentItem = list[i];
            const currentItemLabel = currentItem.innerText.toLowerCase();

            if (currentItemLabel.indexOf(input) === 0) {
                if (
                    (listPasses === 0 &&
                        currentFirstLetter === input.substring(0, 1) &&
                        i < this.currentListPosition) ||
                    (currentItem.dataset.selected === 'true' &&
                        input.length === 1)
                ) {
                    // this is required if we've reached the end of the list and landed on an active item
                    // as the last element -- we will need to loop back for another pass at this point
                    if (listPasses === 0 && i === list.length - 1) {
                        listPasses = 1;
                        i = 0;
                    }
                    continue;
                } else {
                    this.clearSelectedOptions();
                    this.setOption(currentItem);
                    this.setValue(currentItem);
                    this.setLabel(currentItem);
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

    private filterListStarts(input: string): void {
        let exactmatch = false;
        const droplistparentnode = this.element.parentNode;
        droplistparentnode.removeChild(this.element);

        if (input.length < this.properties.mincharactersforlist) {
            this.clearSelectedOptions();
            this.displayEmptyMessage(false);
            this.displayMinCharacterMessage(true);
            input = '';
        } else {
            this.displayMinCharacterMessage(false);
        }

        input = input.toLowerCase();
        let visibleItems = this.list.length;

        for (let i = 0; i < this.list.length; i++) {
            const itemLabel = this.sanitiseText(
                this.list[i].innerText.toLowerCase(),
            );

            if (itemLabel === input && this.properties.exact) {
                exactmatch = true;
                this.clearSelectedOptions();
                this.setSelectedOptionByNode(this.list[i]);
            }

            if (itemLabel.indexOf(input) === 0) {
                this.list[i].classList.remove('filter-hidden');
            } else {
                this.list[i].classList.add('filter-hidden');
                visibleItems--;
            }
        }

        if (visibleItems === 0) {
            this.clearSelectedOptions();
            this.displayEmptyMessage(true);
        } else {
            this.displayEmptyMessage(false);
        }

        if (this.properties.exact && !exactmatch) {
            this.clearSelectedOptions();
        }

        droplistparentnode.appendChild(this.element);
        this.list = this.buildVisibleList();

        if (this.properties.exact && exactmatch) {
            this.notifyListInput();
        }
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
            this.classList.add('charrestriction');
        } else {
            this.classList.remove('charrestriction');
        }
    }

    private filterListContains(inputstring: string): void {
        let exactMatch = false;

        if (inputstring.length < this.properties.mincharactersforlist) {
            this.clearSelectedOptions();
            this.displayEmptyMessage(false);
            this.displayMinCharacterMessage(true);
            return;
        } else {
            this.displayMinCharacterMessage(false);
        }

        inputstring = inputstring.toLowerCase();
        let visibleitems = this.list.length;
        const droplistparentnode = this.element.parentNode;
        droplistparentnode.removeChild(this.element);

        for (let i = 0; i < this.list.length; i++) {
            const itemlabel = this.sanitiseText(
                this.list[i].innerText.toLowerCase(),
            );

            if (itemlabel === inputstring && this.properties.exact) {
                exactMatch = true;
                this.clearSelectedOptions();
                this.setSelectedOptionByNode(this.list[i]);
            }

            if (itemlabel.indexOf(inputstring) !== -1) {
                this.list[i].classList.remove('filter-hidden');
            } else {
                this.list[i].classList.add('filter-hidden');
                visibleitems--;
            }
        }

        if (visibleitems === 0) {
            this.clearSelectedOptions();
            this.displayEmptyMessage(true);
        } else {
            this.displayEmptyMessage(false);
        }

        if (this.properties.exact && !exactMatch) {
            this.clearSelectedOptions();
        }

        droplistparentnode.appendChild(this.element);
        this.list = this.buildVisibleList();

        if (this.properties.exact && exactMatch) {
            this.notifyListInput();
        }
    }

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        this.mouseEvent = true;
        const clickedElement = <HTMLElement>e.target;
        const listItem = clickedElement.closest('li');

        if (!listItem || listItem.dataset.selected === 'true') {
            return;
        }

        this.clearSelectedOptions();
        this.setOption(listItem);
        this.setValue(listItem);
        this.setLabel(listItem);
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
        this.currentListPosition = parseInt(optionPosition);
        option.dataset.selected = 'true';
        option.ariaSelected = 'true';
        this.updateScrollPosition();
    }

    private setSelectedOptionByIndex(): void {
        this.clearSelectedOptions();

        const currentVisibleList = this.buildVisibleList();
        const listItem = currentVisibleList[this.currentListPosition];
        console.log(`jumping to ${this.currentListPosition}`);
        if (typeof listItem === 'undefined') {
            return;
        }

        this.setOption(listItem);
        this.setValue(listItem);
        this.setLabel(listItem);
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
            typeof e.detail.element.value !== 'undefined' &&
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
        this.properties.filtermethod = 'jump';
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.element = this.querySelector('input');
        this.buildList();
        this.indexList();
        this.setListHeight(); // setListHeight must precede restoreSelection to ensure a pre-selected item is correctly scrolled into view
        this.restoreSelection();
        this.setFilterMethod();

        this.addEventListener('click', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
        this.addEventListener('keyup', this.handleEvent);
        if (this.response) this.response.addObserver(this);
        this.control = this.closest('o-dropdown, o-combobox');
        if (this.control) this.control.addObserver(this);
    }
}
