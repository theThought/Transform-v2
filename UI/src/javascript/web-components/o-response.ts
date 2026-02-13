import { Subject, Observer } from '../interfaces';
import { decodeHTML, replaceHTMLPlaceholder } from './util';
import Component from './component';
import OQuestion from './o-question';

interface QuestionProperties {
    filter: {
        source: string;
        exclusions: string[];
    };
    visible?: {
        rules: string;
        collapse?: boolean;
    };
    invisible?: {
        rules: string;
        collapse?: boolean;
    };
    options?: {
        invisible?: Array<{
            name: string;
            rules: string;
            parsedRule?: string;
        }>;
        visible?: Array<{
            name: string;
            rules: string;
            parsedRule?: string;
        }>;
    };
    labels?: {
        alternatives?: Array<{
            visible?: { rules: string };
            invisible?: { rules: string };
            name?: string;
            block?: boolean;
            label?: string;
            parsedRule?: string;
        }>;
        separator?: string;
    };
    separator: boolean;
    resettonull: boolean;
}

export default class OResponse extends Component implements Subject, Observer {
    public properties: QuestionProperties = {
        filter: {
            source: '',
            exclusions: [],
        },
        options: {
            invisible: [],
            visible: [],
        },
        separator: true,
        resettonull: true,
    };

    protected question: OQuestion | null = null;
    private observers: Observer[] = [];
    private ready = false;
    private optionRuleParsingComplete = false;
    private hasOptionVisibilityRules = false;
    private alternativeRuleParsingComplete = false;
    private responses: Record<string, any> = [];
    private sourceQuestions: Record<string, any> = [];
    private complexVisibilityRule = '';
    private expandedVisibilityRule = '';
    private ruleParsingComplete = false;
    private available = true;
    private initialValues: FormData | null = null;

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'exclusiveOn':
                this.exclusiveOn(e as CustomEvent);
                break;
            case 'exclusiveOff':
                this.exclusiveOff(e as CustomEvent);
                break;
            case 'broadcastChange':
                this.handleChange(e as CustomEvent);
                break;
            case 'questionChange':
                this.processVisibilityRulesFromExternalTrigger(
                    e as CustomEvent,
                );
                this.processOptionVisibilityRulesFromExternalTrigger(
                    e as CustomEvent,
                );
                this.handleQuestionChange(e as CustomEvent);
                break;
            case 'questionVisibility':
                if (this !== e.target) e.stopImmediatePropagation();
                break;
        }
    }

    private exclusiveOn(e: CustomEvent): void {
        this.notifyObservers('clearValue', e);
    }

    private exclusiveOff(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyObservers('exclusiveRestore', e);
    }

    private handleChange(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyOtherQuestions(e);
        this.updateAnswerCount(e);
        if (!e.detail.element.value) return;
        this.notifyObservers('clearExclusives', e);
    }

    private notifyOtherQuestions(e: CustomEvent): void {
        const questionChange = new CustomEvent('questionChange', {
            bubbles: true,
            detail: e.detail,
        });

        this.dispatchEvent(questionChange);
    }

    public update(method: string, detail: CustomEvent): void {
        switch (method) {
            case 'questionChange':
                this.processVisibilityRulesFromExternalTrigger(detail);
                this.processOptionVisibilityRulesFromExternalTrigger(detail);
                this.handleQuestionChange(detail);
                break;
            case 'restore':
                this.restoreInitialState();
                break;
            case 'clearValues':
                this.clearChildren();
                break;
        }
    }

    private handleQuestionChange(e: CustomEvent): void {
        // prevent questions from reacting to their own broadcast events
        if (e.target === this) return;

        this.processAlternativeVisibilityRulesFromExternalTrigger(e);

        // check whether this question needs to react to external changes
        if (this.properties.filter.source) {
            this.processFilter(e);
        }
    }

    private processFilter(e: CustomEvent): void {
        // the incoming question is not included in the list of filter sources
        if (
            e.detail.qgroup
                .toLowerCase()
                .indexOf(this.properties.filter.source.toLowerCase()) === -1
        ) {
            return;
        }

        if (typeof e.detail.checkbox !== 'undefined') {
            if (e.detail.checkbox.checked) {
                this.hideOption(e.detail.checkbox.value, 'filter');
            } else {
                this.showOption(e.detail.checkbox.value, 'filter');
            }
        } else {
            if (!e.detail.element.value.length) {
                this.showOption(null, 'filter');
            } else {
                this.hideOption(e.detail.element.value.toLowerCase(), 'filter');
            }
        }
    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
        if (observer.nodeName === 'O-LIST') this.processOptionVisibilityRules();
    }

    public removeObserver(observer: Observer): void {
        const index = this.observers.findIndex((obs) => obs === observer);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }

    public notifyObservers(method: string, detail: CustomEvent): void {
        this.observers.forEach((observer) => observer.update(method, detail));
    }

    private updateAnswerCount(e: CustomEvent): void {
        this.responses[e.detail.qid] = e.detail.value;
    }

    private hideOption(itemValue: string, hideMethod: string): void {
        const option =
            this.querySelector(
                `:not([type='hidden'])[value='${itemValue}' i]`,
            ) ??
            this.querySelector(
                `:not([type='hidden'])[data-value='${itemValue}' i]`,
            );

        if (!option) return;

        if (option instanceof HTMLElement) {
            if (
                option.tagName === 'INPUT' &&
                !option.classList.contains('a-input-combobox')
            ) {
                (option as HTMLInputElement).checked = false;
                const parent = option.parentElement;
                if (parent) {
                    this.applyHideMethod(parent, hideMethod);
                }
            }
        }

        this.sendOptionVisibilityChange(option, 'hidden', hideMethod);
        this.sendResizeNotifier();
    }

    private applyHideMethod(element: HTMLElement, method: string): void {
        if (method === 'filter') {
            element.classList.add('hidden-filter');
        } else {
            element.classList.add('hidden-rule');
            element.tabIndex = -1;
        }

        const input = element.querySelector('input');
        if (input) {
            input.disabled = true;
        }
    }

    private showOption(itemValue: string | null, hideMethod: string): void {
        const option =
            itemValue === null
                ? this.querySelector('.hidden-filter')
                : (this.querySelector(`[value='${itemValue}' i]`) ??
                  this.querySelector(`[data-value='${itemValue}' i]`));

        if (!option) return;

        if (option instanceof HTMLElement) {
            if (
                option.tagName === 'INPUT' &&
                !option.classList.contains('a-input-combobox')
            ) {
                const parent = option.parentElement;
                if (parent) {
                    const classList =
                        hideMethod === 'filter'
                            ? 'hidden-filter'
                            : 'hidden-rule';
                    parent.classList.remove(classList);
                }
            }

            if (option instanceof HTMLInputElement) {
                option.disabled = false;
                option.classList.remove('hidden-rule');
            }

            if (option instanceof HTMLLIElement) {
                option.classList.remove('hidden-rule');
            }
        }

        this.sendOptionVisibilityChange(option, 'visible', hideMethod);
        this.sendResizeNotifier();
    }

    private sendOptionVisibilityChange(
        option: Element | null,
        visibility: string,
        hideMethod: string = 'filter',
    ): void {
        const detail = new CustomEvent('optionVisibilityChange', {
            detail: {
                element: option,
                visibility: visibility,
                hideMethod: hideMethod,
            },
        });
        this.notifyObservers('optionVisibilityChange', detail);
    }

    private sendResizeNotifier(): void {
        if (typeof Event === 'function') {
            window.dispatchEvent(new Event('resize'));
        } else {
            const evt = document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }
    }

    private processOptionVisibilityRulesFromExternalTrigger(
        e: CustomEvent,
    ): void {
        if (!this.ready) return;

        if (this.element === e.detail.element) {
            return;
        }

        this.processOptionVisibilityRules();
    }

    private processOptionVisibilityRules(): void {
        if (!this.optionRuleParsingComplete) {
            this.parseOptionVisibilityRules();
        }

        if (!this.hasOptionVisibilityRules) {
            return;
        }

        this.getQuestionValues();

        if (this.properties.options?.invisible) {
            this.properties.options.invisible.forEach((option) => {
                if (option.parsedRule === undefined) return;

                let invisibleRuleString = option.parsedRule;
                invisibleRuleString =
                    this.insertQuestionValuesIntoRule(invisibleRuleString);

                if (this.evaluateRule(invisibleRuleString)) {
                    this.hideOption(option.name, 'rule');
                } else {
                    this.showOption(option.name, 'rule');
                }
            });
        }

        if (this.properties.options?.visible) {
            this.properties.options.visible.forEach((option) => {
                if (option.parsedRule === undefined) return;

                let ruleString = option.parsedRule;
                ruleString = this.insertQuestionValuesIntoRule(ruleString);

                if (this.evaluateRule(ruleString)) {
                    this.showOption(option.name, 'rule');
                } else {
                    this.hideOption(option.name, 'rule');
                }
            });
        }
    }

    private processAlternativeVisibilityRulesFromExternalTrigger(
        e: CustomEvent,
    ): void {
        if (this.element === e.detail.element) {
            return;
        }

        this.processAlternativeVisibilityRules();
    }

    private processAlternativeVisibilityRules(): void {
        if (!this.alternativeRuleParsingComplete) {
            this.parseAlternativeVisibilityRules();
        }

        if (!this.properties?.labels?.alternatives) {
            return;
        }

        this.getQuestionValues();

        this.properties.labels.alternatives.forEach((item) => {
            if (!item.parsedRule) return;
            const ruleString = this.insertQuestionValuesIntoRule(
                item.parsedRule,
            );

            const itemName = item.name ?? '';

            if (typeof item.visible !== 'undefined') {
                this.evaluateAlternativeVisibleRule(ruleString, itemName);
            } else {
                this.evaluateAlternativeInvisibleRule(ruleString, itemName);
            }
        });
    }

    private evaluateAlternativeVisibleRule(rule: string, name: string): void {
        if (this.evaluateRule(rule)) {
            this.makeAlternativeAvailable(name);
        } else {
            this.makeAlternativeUnavailable(name);
        }
    }

    private evaluateAlternativeInvisibleRule(rule: string, name: string): void {
        if (this.evaluateRule(rule)) {
            this.makeAlternativeUnavailable(name);
        } else {
            this.makeAlternativeAvailable(name);
        }
    }

    private makeAlternativeAvailable(name: string): void {
        const labelElement = document.querySelector(
            '.o-question-information-content[name="' + name + '"]',
        );

        if (!labelElement) return;
        labelElement.classList.remove('unavailable');
    }

    private makeAlternativeUnavailable(name: string): void {
        const labelElement = document.querySelector(
            '.o-question-information-content[name="' + name + '"]',
        );

        if (!labelElement) return;
        labelElement.classList.add('unavailable');
    }

    private parseOptionVisibilityRules(): void {
        if (!this.properties.options) {
            this.optionRuleParsingComplete = true;
            return;
        }

        if (this.properties.options.invisible) {
            this.properties.options.invisible.forEach((option) => {
                this.hasOptionVisibilityRules = true;
                const invisibleRuleString = option.rules;
                const invisibleOptionName = option.name;
                option.name = this.escapeString(invisibleOptionName);
                option.parsedRule =
                    this.parseVisibilityRules(invisibleRuleString);
            });
        }

        if (this.properties.options.visible) {
            this.properties.options.visible.forEach((option) => {
                this.hasOptionVisibilityRules = true;
                const ruleString = option.rules;
                const optionName = option.name;
                option.name = this.escapeString(optionName);
                option.parsedRule = this.parseVisibilityRules(ruleString);
            });
        }

        this.optionRuleParsingComplete = true;
    }

    private parseAlternativeVisibilityRules(): void {
        if (typeof this.properties.labels === 'undefined') {
            this.alternativeRuleParsingComplete = true;
            return;
        }

        if (typeof this.properties.labels.alternatives === 'undefined') {
            this.alternativeRuleParsingComplete = true;
            return;
        }

        for (let i = 0; i < this.properties.labels.alternatives.length; i++) {
            let rule = '';

            if (this.properties.labels.alternatives[i].visible) {
                rule =
                    this.properties.labels.alternatives[i].visible?.rules ?? '';
            } else {
                rule =
                    this.properties.labels.alternatives[i].invisible?.rules ??
                    '';
            }

            this.properties.labels.alternatives[i].parsedRule =
                this.parseVisibilityRules(rule);
        }

        this.alternativeRuleParsingComplete = true;
    }

    protected parseVisibilityRules(ruleString: string): string {
        if (!ruleString) return '';

        ruleString = this.expandContainsAnyRule(ruleString);
        ruleString = this.expandContainsAllRule(ruleString);
        ruleString = this.expandContainsNoneRule(ruleString);
        ruleString = this.expandAnswerCountRule(ruleString);
        ruleString = this.expandIsVisibleRule(ruleString);
        ruleString = this.replaceOperators(ruleString);
        ruleString = this.extractQuestionIdentifiers(ruleString);

        return ruleString;
    }

    private escapeString(ruleString: string): string {
        ruleString = ruleString.replace(/__([^Q])/g, '_$1');
        ruleString = ruleString.replace(/_([^Q])/g, '__$1');
        return ruleString;
    }

    protected evaluateRule(ruleString: string): boolean {
        try {
            return new Function(`return ${ruleString}`)();
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private getQuestionValues(): void {
        for (const question in this.sourceQuestions) {
            if (this.sourceQuestions.hasOwnProperty(question)) {
                this.sourceQuestions[question] = [];
                let questionElements;

                // retrieve questions required by this rule based on a matching response container or grid row container
                questionElements = document.querySelectorAll(
                    "input[id][data-question-group$='" +
                        question +
                        "'], select[id][data-question-group$='" +
                        question +
                        "']",
                );

                if (!questionElements.length) {
                    // if no questions were found directly, retrieve questions contained in a row
                    questionElements = document.querySelectorAll(
                        "tr[data-question-group$='" +
                            question +
                            "'] input[id], tr[data-question-group$='" +
                            question +
                            "'] select[id]",
                    );
                }

                if (!questionElements.length) {
                    // if no questions were found while searching rows, retrieve questions by container
                    questionElements = document.querySelectorAll(
                        "div[data-question-group$='" +
                            question +
                            "'] input[id], div[data-question-group$='" +
                            question +
                            "'] select[id]",
                    );
                }

                if (!questionElements.length) {
                    console.warn(
                        'Could not find a question required by a visibility rule: ' +
                            question,
                    );
                } else {
                    for (let j = 0; j < questionElements.length; j++) {
                        const element = questionElements[j] as HTMLInputElement;
                        // determine the input type - required for handling unselected checkboxes/radio buttons
                        const questionType = element.type;

                        if (
                            questionType === 'button' ||
                            ((questionType === 'checkbox' ||
                                questionType === 'radio') &&
                                !element.checked)
                        ) {
                            continue;
                        }

                        const questionValue = element.value;
                        this.sourceQuestions[question].push(questionValue);
                    }
                }
            }
        }
    }

    private insertQuestionValuesIntoRule(ruleString: string): string {
        for (const question in this.sourceQuestions) {
            let qData = '';

            if (this.sourceQuestions.hasOwnProperty(question)) {
                qData = this.sourceQuestions[question].join("','");
            }

            if (qData.length) {
                qData = "'" + qData.toLowerCase() + "'";
            }

            const arrayQuestions = new RegExp(
                '\\[%%' + question + '%%\\]',
                'g',
            );
            ruleString = ruleString.replace(arrayQuestions, '[' + qData + ']');

            const simpleQuestions = new RegExp('%%' + question + '%%', 'g');

            if (qData.length) {
                ruleString = ruleString.replace(simpleQuestions, qData);
            } else {
                ruleString = ruleString.replace(
                    simpleQuestions,
                    "'" + qData + "'",
                );
            }
        }

        return ruleString;
    }

    // Helper methods for rule expansion
    private expandContainsAnyRule(ruleString: string): string {
        if (ruleString.toLowerCase().indexOf('containsany') === -1) {
            return ruleString;
        }

        const re = /\s?(\w+)\.containsAny\((.*?)\)/gi;
        let matches;

        // match 0: full string
        // match 1: question
        // match 2: contains string
        while (null !== (matches = re.exec(ruleString))) {
            let expandedString =
                '[' +
                this.escapeString(matches[2]).toLowerCase() +
                '].some(function (val) {return [%%' +
                this.escapeString(matches[1]) +
                '%%].indexOf(val) >= 0})';
            expandedString = ' (' + expandedString + ') ';
            ruleString = ruleString.replace(matches[0], expandedString);
        }

        return ruleString;
    }

    private expandContainsAllRule(ruleString: string): string {
        if (ruleString.toLowerCase().indexOf('containsall') === -1) {
            return ruleString;
        }

        const re = /\s?(\w+)\.containsAll\((.*?)\)/gi;
        let matches;

        // match 0: full string
        // match 1: question
        // match 2: contains string
        while (null !== (matches = re.exec(ruleString))) {
            let expandedString =
                '[' +
                this.escapeString(matches[2]).toLowerCase() +
                '].every(function (val) {return [%%' +
                this.escapeString(matches[1]) +
                '%%].indexOf(val) >= 0})';
            expandedString = ' (' + expandedString + ') ';
            ruleString = ruleString.replace(matches[0], expandedString);
        }

        return ruleString;
    }

    private expandContainsNoneRule(ruleString: string): string {
        if (ruleString.toLowerCase().indexOf('containsnone') === -1) {
            return ruleString;
        }

        const re = /\s?(\w+)\.containsNone\((.*?)\)/gi;
        let matches;

        // match 0: full string
        // match 1: question
        // match 2: contains string
        while (null !== (matches = re.exec(ruleString))) {
            let expandedString =
                '[' +
                this.escapeString(matches[2]).toLowerCase() +
                '].every(function (val) {return [%%' +
                this.escapeString(matches[1]) +
                '%%].indexOf(val) == -1})';
            expandedString = ' (' + expandedString + ') ';
            ruleString = ruleString.replace(matches[0], expandedString);
        }

        return ruleString;
    }

    private expandAnswerCountRule(ruleString: string): string {
        if (ruleString.toLowerCase().indexOf('answercount') === -1) {
            return ruleString;
        }

        const re = /\s?(\w+)\.answerCount\(\)(.*?)/gi;
        let matches;

        // match 0: full string
        // match 1: question
        // match 2: contains string
        while (null !== (matches = re.exec(ruleString))) {
            let expandedString =
                '[%%' +
                this.escapeString(matches[1]) +
                '%%].length ' +
                matches[2];
            expandedString = ' (' + expandedString + ') ';
            ruleString = ruleString.replace(matches[0], expandedString);
        }

        return ruleString;
    }

    private expandIsVisibleRule(ruleString: string): string {
        if (ruleString.toLowerCase().indexOf('isvisible') === -1) {
            return ruleString;
        }

        const re = /\s?(\w+)\.isVisible\(\)/gi;
        let matches;

        // match 0: full string
        // match 1: question
        while (null !== (matches = re.exec(ruleString))) {
            let expandedString =
                '!document.querySelector(\'o-response[data-question-group*="';
            expandedString += this.escapeString(matches[1]);
            expandedString += "\"]').classList.contains('unavailable')";

            expandedString = ' (' + expandedString + ') ';

            ruleString = ruleString.replace(matches[0], expandedString);
        }

        return ruleString;
    }

    private replaceOperators(ruleString: string): string {
        const questionRe = /\s?([a-zA-Z0-9_]+)\s([=<>+-]+)/g;

        ruleString = ruleString.replace(/or /gi, '|| ');
        ruleString = ruleString.replace(/and /gi, '&& ');
        ruleString = ruleString.replace(/%gt%/g, '>');
        ruleString = ruleString.replace(/%lt%/g, '<');
        ruleString = ruleString.replace(questionRe, ' %%$1%% $2 ');
        ruleString = ruleString.replace(/[^=!<>*]=[^=]/g, '==');

        return ruleString;
    }

    private extractQuestionIdentifiers(ruleString: string): string {
        const questionRe = /%%(\w+)%%/g;
        const questionsInRule = ruleString.match(questionRe);

        if (!questionsInRule) {
            return ruleString;
        }

        const questions = [...new Set(questionsInRule)];

        for (let i = 0; i < questions.length; i++) {
            const currentQuestionRe = new RegExp(questions[i], 'g');
            let currentQuestion = questions[i];
            currentQuestion = currentQuestion.replace(questionRe, '_Q$1');
            this.sourceQuestions[currentQuestion] = [];
            ruleString = ruleString.replace(
                currentQuestionRe,
                '%%' + currentQuestion + '%%',
            );
        }

        return ruleString;
    }

    public makeAvailable(): void {
        if (this.available) return;

        this.classList.remove('unavailable');

        this.requestInitialSize();
        this.resetValues();
        this.liftCover();
        this.available = true;

        const questionVisibility = new CustomEvent('questionVisibility', {
            bubbles: true,
            detail: {
                hidden: false,
            },
        });

        this.dispatchEvent(questionVisibility);
    }

    public makeUnavailable(collapse: boolean = true): void {
        if (!this.available) return;

        if (!collapse) this.classList.add('do-not-collapse');
        this.classList.add('unavailable');

        this.available = false;

        const questionVisibility = new CustomEvent('questionVisibility', {
            bubbles: true,
            detail: {
                hidden: true,
                collapse: collapse,
            },
        });

        this.dispatchEvent(questionVisibility);

        this.cover();

        const clearChildren = new CustomEvent('clearChildren', {
            bubbles: true,
        });
        this.dispatchEvent(clearChildren);
    }

    private attachLabels(): void {
        if (!this.properties.labels?.alternatives) {
            return;
        }

        const alternativesContainer = this.closest('o-question')?.querySelector(
            '.o-question-alternatives',
        );

        // guard condition to prevent old-style pages, lacking the new container,
        // from throwing errors
        if (!alternativesContainer) {
            return;
        }

        // do not add the labels a second time
        if (alternativesContainer.childNodes.length > 1) {
            return;
        }

        this.properties.labels.alternatives.forEach((item, idx, arr) => {
            const elementType = item.block ? 'div' : 'span';
            const alternative = document.createElement(elementType);

            alternative.setAttribute('name', item.name ?? '');
            alternative.classList.add('o-question-information-content');
            alternative.innerHTML = decodeHTML(
                replaceHTMLPlaceholder(item.label ?? ''),
            );

            if (
                this.properties.labels?.separator !== 'undefined' &&
                this.properties.labels?.separator?.length &&
                idx !== arr.length - 1
            ) {
                const alternativeSeparator = document.createElement('span');
                alternativeSeparator.className =
                    'a-label-alternative-separator';
                alternativeSeparator.innerHTML =
                    this.properties.labels.separator;
                alternative.appendChild(alternativeSeparator);
            }

            alternativesContainer.appendChild(alternative);
        });
    }

    private resetValues(): void {
        if (this.available) return;

        const restoreEntries = new CustomEvent('restoreEntries', {
            bubbles: true,
            detail: this,
        });

        this.dispatchEvent(restoreEntries);
    }

    private clearChildren(): void {
        const clearVisibility = new CustomEvent('clearVisibility', {
            bubbles: true,
            detail: this,
        });

        this.notifyObservers('clearValue', clearVisibility);
    }

    private cover(): void {
        this.classList.remove('cover-off');
    }

    private liftCover(): void {
        this.classList.add('cover-off');
    }

    private requestInitialSize(): void {
        const requestSize = new CustomEvent(this.qgroup + '_requestSize', {
            bubbles: true,
            detail: this,
        });

        this.dispatchEvent(requestSize);
    }

    public forwardResizeMessage(
        width?: number | null,
        height?: number | null,
    ): void {
        const resizeMessage = new CustomEvent('resizeMessage', {
            bubbles: true,
            detail: {
                width: width ?? '',
                height: height ?? '',
            },
        });
        this.notifyObservers('resizeMessage', resizeMessage);
    }

    public configureInitialVisibility(): void {
        // lift the cover immediately if there are no visibility rules defined
        if (
            typeof this.properties.visible === 'undefined' &&
            typeof this.properties.invisible === 'undefined'
        ) {
            this.makeAvailable();
            return;
        }

        let collapse = true;

        if (this.properties?.visible?.collapse === false) {
            collapse = false;
        }

        if (this.properties?.invisible?.collapse === false) {
            collapse = false;
        }

        // this question has visibility rules so should begin in the hidden state
        this.makeUnavailable(collapse);
    }

    public processVisibilityRules(): void {
        if (
            typeof this.properties.visible === 'undefined' &&
            typeof this.properties.invisible === 'undefined'
        ) {
            this.ruleParsingComplete = true;
            return;
        }

        if (typeof this.properties.visible !== 'undefined') {
            this.processVisibleRules();
        }

        if (typeof this.properties.invisible !== 'undefined') {
            this.processInvisibleRules();
        }
    }

    private processVisibleRules(): void {
        if (!this.ruleParsingComplete && this.properties.visible) {
            this.complexVisibilityRule = this.properties.visible.rules;
            this.expandedVisibilityRule = this.parseVisibilityRules(
                this.complexVisibilityRule,
            );
            this.ruleParsingComplete = true;
        }

        if (
            typeof this.expandedVisibilityRule === 'undefined' ||
            this.expandedVisibilityRule === ''
        ) {
            return;
        }

        this.getQuestionValues();
        const ruleString = this.insertQuestionValuesIntoRule(
            this.expandedVisibilityRule,
        );

        if (this.evaluateRule(ruleString)) {
            this.makeAvailable();
        } else {
            const collapse = this.properties.visible?.collapse ?? true;
            this.makeUnavailable(collapse);
        }
    }

    private processInvisibleRules(): void {
        if (!this.ruleParsingComplete && this.properties.invisible) {
            this.complexVisibilityRule = this.properties.invisible.rules;
            this.expandedVisibilityRule = this.parseVisibilityRules(
                this.complexVisibilityRule,
            );
            this.ruleParsingComplete = true;
        }

        if (
            typeof this.expandedVisibilityRule === 'undefined' ||
            this.expandedVisibilityRule === ''
        ) {
            return;
        }

        this.getQuestionValues();
        const ruleString = this.insertQuestionValuesIntoRule(
            this.expandedVisibilityRule,
        );

        if (this.evaluateRule(ruleString)) {
            const collapse = this.properties.invisible?.collapse ?? true;
            this.makeUnavailable(collapse);
        } else {
            this.makeAvailable();
        }
    }

    public processVisibilityRulesFromExternalTrigger(e: CustomEvent): void {
        if (!this.ready) return;

        if (this.element === e.detail.element) {
            return;
        }

        if (typeof this.properties.visible !== 'undefined') {
            this.processVisibleRules();
        }

        if (typeof this.properties.invisible !== 'undefined') {
            this.processInvisibleRules();
        }
    }

    private setSeparatorStyle(): void {
        if (this.properties.separator) return;
        const separatorEvent = new CustomEvent('setSeparatorStyle', {
            bubbles: true,
            detail: {
                separator: false,
                questionGroup: this.dataset.questionGroup,
            },
        });
        this.dispatchEvent(separatorEvent);
    }

    private storeInitialState(): void {
        const initialFormValues = new FormData();
        const formElements: NodeListOf<HTMLFormElement> = this.querySelectorAll(
            'input, select, textarea',
        );
        if (formElements.length === 0) return;

        formElements.forEach((formItem) => {
            if (typeof formItem.name == 'undefined' || !formItem.name) return;
            if (
                (formItem.type === 'checkbox' || formItem.type === 'radio') &&
                !formItem.checked
            )
                return;
            initialFormValues.append(formItem.name, formItem.value);
        });
        this.initialValues = initialFormValues;
    }

    private restoreInitialState(): void {
        const restoreSavedValues =
            this.dataset.restoreInitialQuestionValues ??
            document.body.dataset.restoreInitialQuestionValues;
        if (!restoreSavedValues || this.initialValues === null) return;

        this.initialValues.forEach((itemValue, itemName) => {
            const element: HTMLInputElement | null = this.querySelector(
                `input[type="checkbox"][value="${itemValue}"], input[type="radio"][value="${itemValue}"], input:not([type="checkbox"]):not([type="radio"])[name="${itemName}"]`,
            );
            if (!element) return;

            if (element.type === 'checkbox' || element.type === 'radio') {
                element.checked = true;
            } else {
                element.value = itemValue as string;
            }
        });
    }

    private setResetBehaviour(): void {
        if (this.properties.resettonull) return;
        this.dataset.restoreInitialQuestionValues = 'true';
    }

    private setQuestion(): void {
        this.question = this.closest('o-question');

        if (this.question) {
            this.question.addObserver(this);
        }
    }

    public connectedCallback(): void {
        this.parseProperties();
        this.setQuestion();
        this.storeInitialState();
        this.setResetBehaviour();
        this.addEventListener('exclusiveOn', this.handleEvent);
        this.addEventListener('exclusiveOff', this.handleEvent);
        this.addEventListener('broadcastChange', this.handleEvent);
        this.addEventListener('questionVisibility', this.handleEvent);
        document.addEventListener('questionChange', this);
        this.attachLabels();
        this.setSeparatorStyle();
        this.configureInitialVisibility();
        this.processOptionVisibilityRules();
        this.processVisibilityRules();
        this.processAlternativeVisibilityRules();
        this.ready = true;
    }

    public disconnectedCallback(): void {
        document.removeEventListener('questionChange', this);
        if (this.question) this.question.removeObserver(this);
    }
}
