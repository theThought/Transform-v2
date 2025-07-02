import { Subject, Observer } from '../interfaces';
import Component from './component';
import { uniq } from './util';

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
            rules?: string;
            parsedRule?: string;
        }>;
        visible?: Array<{
            name: string;
            rules?: string;
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
}

export default class OResponse extends Component implements Subject {
    public properties: QuestionProperties = {
        filter: {
            source: '',
            exclusions: [],
        },
        options: {
            invisible: [],
            visible: [],
        },
    };

    private observers: Observer[] = [];
    private ready = false;
    private isFiltered = false;
    private isReadOnly = false;
    private optionRuleParsingComplete = false;
    private alternativeRuleParsingComplete = false;
    private hasOptionVisibilityRules = false;
    private responses: Record<string, any> = [];
    private container: HTMLElement | null = null;
    private element: HTMLElement | null = null;
    private filterSource = '';
    private filterExclusions: string[] = [];

    private sourceQuestions: Record<string, any> = {};
    private complexVisibilityRule = '';
    private expandedVisibilityRule = '';
    private expandedCalculation = '';
    private ruleParsingComplete = false;
    private hasAlternativeVisibilityRules = false;
    private available = false;

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
                this.handleQuestionChange(e as CustomEvent);
                break;
        }
    }

    private exclusiveOn(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyObservers('exclusiveClear', e);
    }

    private exclusiveOff(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyObservers('exclusiveRestore', e);
    }

    private handleChange(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyOtherQuestions(e);
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

    private handleQuestionChange(e: CustomEvent): void {
        // prevent questions from reacting to their own broadcast events
        if (e.target === this) return;

        // check whether this question needs to react to external changes
        if (this.properties.filter.source) {
            this.processFilter(e);
        }
    }

    private processFilter(e: CustomEvent): void {
        // the incoming question is not included in the list of filter sources
        if (
            e.detail.qgroup.toLowerCase() !==
            this.properties.filter.source.toLowerCase()
        ) {
            return;
        }

        this.notifyObservers('filter', e);
    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
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
        if (!this.contains(e.detail.element)) {
            return;
        }
        this.responses[e.detail.id] = e.detail.value;
    }

    public filter(props: { source: string; exclusions: string[] }): void {
        this.isFiltered = true;
        this.filterSource = props.source;
        this.filterExclusions = props.exclusions;
    }

    private hideOption(itemValue: string, hideMethod: string): void {
        const option = this.querySelector(
            `.hiddencontrol[value='${itemValue}'], [data-value='${itemValue}']`,
        );

        if (!option) return;

        const optionVisibilityBroadcast = new CustomEvent(
            this.qgroup + '_optionVisibility',
            {
                bubbles: true,
                detail: { itemValue, hideMethod },
            },
        );
        this.dispatchEvent(optionVisibilityBroadcast);

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
            } else {
                this.applyHideMethod(option, hideMethod);
            }
        }

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
        if (!this.element) {
            this.element = document.querySelector(
                `div[class*="o-question-"][data-question-group*="${this.qgroup}"]`,
            );
        }
        if (!this.element) return;

        const option =
            itemValue === null
                ? this.querySelector('.hidden-filter')
                : this.querySelector(
                      `[value='${itemValue}'], [data-value='${itemValue}']`,
                  );

        if (!option) return;

        if (option instanceof HTMLElement) {
            const classList =
                hideMethod === 'filter' ? 'hidden-filter' : 'hidden-rule';
            option.classList.remove(classList);

            const input = option.querySelector('input');
            if (input) {
                input.disabled = false;
            }
        }

        this.sendResizeNotifier();
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

        console.info('Processing option visibility rules for ' + this.qgroup);
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

    protected parseVisibilityRules(ruleString: string): string | undefined {
        if (!ruleString) return undefined;

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
            // Using Function instead of eval for better scoping
            return new Function(`return ${ruleString}`)();
        } catch (e) {
            console.error(`Error evaluating rule: ${ruleString}`);
            return false;
        }
    }

    private getQuestionValues(): void {
        for (const currentQuestion in this.sourceQuestions) {
            if (this.sourceQuestions.hasOwnProperty(currentQuestion)) {
                this.sourceQuestions[currentQuestion] = [];
                let questionElements;

                // retrieve questions required by this rule based on a matching response container or grid row container
                questionElements = document.querySelectorAll(
                    "input[id][data-question-group$='" +
                        currentQuestion +
                        "'], select[id][data-question-group$='" +
                        currentQuestion +
                        "']",
                );

                if (!questionElements.length) {
                    // if no questions were found directly, retrieve questions contained in a row
                    questionElements = document.querySelectorAll(
                        "tr[data-question-group$='" +
                            currentQuestion +
                            "'] input[id], tr[data-question-group$='" +
                            currentQuestion +
                            "'] select[id]",
                    );
                }

                if (!questionElements.length) {
                    // if no questions were found by row, retrieve questions by container
                    questionElements = document.querySelectorAll(
                        "div[data-question-group$='" +
                            currentQuestion +
                            "'] input[id], div[data-question-group$='" +
                            currentQuestion +
                            "'] select[id]",
                    );
                }

                if (!questionElements.length) {
                    console.warn(
                        'Could not find a question required by a visibility rule: ' +
                            currentQuestion,
                    );
                } else {
                    for (let j = 0; j < questionElements.length; j++) {
                        // determine the input type - required for handling unselected checkboxes/radio buttons
                        const questionType = questionElements[j].type;

                        if (
                            questionType === 'button' ||
                            ((questionType === 'checkbox' ||
                                questionType === 'radio') &&
                                !questionElements[j].checked)
                        ) {
                            continue;
                        }

                        const questionValue = questionElements[j].value;
                        this.sourceQuestions[currentQuestion].push(
                            questionValue,
                        );
                    }

                    this.sourceQuestions[currentQuestion] = uniq(
                        this.sourceQuestions[currentQuestion],
                    );
                }
            }
        }
    }

    private x_insertQuestionValuesIntoRule(ruleString: string): string {
        // Replace question identifiers with actual values from sourceQuestions
        return Object.entries(this.sourceQuestions).reduce(
            (str, [id, value]) =>
                str.replace(new RegExp(id, 'g'), String(value)),
            ruleString,
        );
    }

    private insertQuestionValuesIntoRule(ruleString: string): string {
        for (const question in this.sourceQuestions) {
            let qData = '';

            if (this.sourceQuestions.hasOwnProperty(question)) {
                qData = this.sourceQuestions[question].join("','");
            }

            qData = "'" + qData.toLowerCase() + "'";

            const allQuestions = new RegExp('%%' + question + '%%', 'g');
            ruleString = ruleString.replace(allQuestions, qData);
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
                'document.querySelector(\'o-response[data-question-group*="';
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
        let questions = ruleString.match(questionRe);

        if (!questions) {
            return ruleString;
        }

        questions = uniq(questions);

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

        const broadcastAvailability = new CustomEvent('broadcastAvailability', {
            bubbles: true,
            detail: this,
        });

        this.dispatchEvent(broadcastAvailability);
    }

    public makeUnavailable(): void {
        if (!this.available) return;

        this.classList.add('unavailable');
        this.available = false;

        this.cover();
        this.clearEntries();
        this.clearChildren();
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
        const clearEntries = new CustomEvent('clearEntries', {
            bubbles: true,
            detail: this,
        });

        this.dispatchEvent(clearEntries);
    }

    private clearEntries(): void {
        // do not clear items that are still initialising
        if (!this.ready) return;

        // this is responsible for clearing text areas
        if (this.element && (this.element as HTMLInputElement).value !== '') {
            (this.element as HTMLInputElement).value = '';
            this.broadcastChange();
        }
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

    protected broadcastChange(): void {
        // do not broadcast events during page initialisation
        if (!this.ready) return;

        // do not broadcast a change when the value has not altered
        if (!this.hasChangedValue()) {
            return;
        }

        const broadcastChange = new CustomEvent('broadcastChange', {
            bubbles: true,
            detail: this,
        });

        this.dispatchEvent(broadcastChange);
    }

    private hasChangedValue(): boolean {
        const oldValue = this.element.value;
        const newValue = this.getCurrentValue();
        this.value = newValue;

        return oldValue !== newValue;
    }

    private getCurrentValue(): string | boolean | null {
        if (!this.element) {
            return null;
        }

        const value = (this.element as HTMLInputElement).value
            ? (this.element as HTMLInputElement).value
            : null;

        if (typeof (this.element as any).checkbox !== 'undefined') {
            return (this.element as any).checkbox.checked;
        }

        return value;
    }

    public configureInitialVisibility(): void {
        // if there are no visibility rules defined for this question lift the cover immediately
        if (
            typeof this.properties.visible === 'undefined' &&
            typeof this.properties.invisible === 'undefined'
        ) {
            this.makeAvailable();
            return;
        }

        // the collapse property removes the space required by the question if it is hidden
        if (
            (typeof this.properties.visible !== 'undefined' &&
                this.properties.visible.collapse === true) ||
            (typeof this.properties.invisible !== 'undefined' &&
                this.properties.invisible.collapse === true)
        ) {
            this.classList.add('collapse');
        }

        // this question has visibility rules so should begin in the hidden state
        this.classList.add('unavailable');
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
        if (!this.ruleParsingComplete) {
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

        console.info('Processing visible rules for ' + this.qgroup);
        console.info(this.complexVisibilityRule);

        this.getQuestionValues();
        const ruleString = this.insertQuestionValuesIntoRule(
            this.expandedVisibilityRule,
        );

        if (this.evaluateRule(ruleString)) {
            this.makeAvailable();
        } else {
            this.makeUnavailable();
        }
    }

    private processInvisibleRules(): void {
        if (!this.ruleParsingComplete) {
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

        console.info('Processing invisible rules for ' + this.qgroup);
        console.info(this.complexVisibilityRule);

        this.getQuestionValues();
        const ruleString = this.insertQuestionValuesIntoRule(
            this.expandedVisibilityRule,
        );

        if (this.evaluateRule(ruleString)) {
            this.makeUnavailable();
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

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('exclusiveOn', this);
        this.addEventListener('exclusiveOff', this);
        this.addEventListener('broadcastChange', this);
        document.addEventListener('questionChange', this);
        this.configureInitialVisibility();
        this.processOptionVisibilityRules();
        this.processVisibilityRules();
        this.ready = true;
    }

    public disconnectedCallback(): void {
        document.removeEventListener('questionChange', this);
    }
}
