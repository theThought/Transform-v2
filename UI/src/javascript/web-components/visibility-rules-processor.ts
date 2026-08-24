import { JsonObject } from './util';

export interface QuestionProperties extends JsonObject {
    filter: {
        source: string;
        exclusions: string[];
    };
    visible: {
        rules: string;
        collapse: boolean;
    };
    invisible: {
        rules: string;
        collapse: boolean;
    };
    options: {
        invisible: Array<{
            name: string;
            rules: string;
            parsedRule: string;
        }>;
        visible: Array<{
            name: string;
            rules: string;
            parsedRule: string;
        }>;
    };
    labels: {
        alternatives: Array<{
            visible: { rules: string };
            invisible: { rules: string };
            name: string;
            block: boolean;
            label: string;
            parsedRule: string;
        }>;
        separator: string;
    };
    separator: boolean;
    resettonull: boolean | null;
    read: {
        source: string;
        name: string;
    };
    write: {
        destination: string;
        name: string;
    };
}

export type QuestionIdentifier = string;
export interface SourceQuestionRecord {
    [key: string]: string[];
}

/**
 * Visibility rule processing utility class
 * Can be used by multiple components (OResponse, FTD elements in palette history)
 */
export default class VisibilityRulesProcessor {
    protected sourceQuestions: Record<string, any> = [];
    protected complexVisibilityRule = '';
    protected expandedVisibilityRule = '';
    private visibilityIsComplete = false;

    /**
     * Initialise the processor with question identifier pattern
     * @param questionIdentifier Identifier pattern for questions (e.g., '%%questionName%%')
     */
    init(questionIdentifier: string): void {
        if (this.sourceQuestions.hasOwnProperty(questionIdentifier)) {
            this.sourceQuestions[questionIdentifier] = [];
        }
    }

    /**
     * Parse and expand visibility rules
     * @param ruleString Raw rule string to be parsed
     */
    public parseVisibilityRules(ruleString: string): string {
        if (!ruleString) return '';

        let processedRule = ruleString;

        // Expand complex rule operators (containsAny, containsAll, containsNone, etc.)
        if (processedRule.toLowerCase().indexOf('containsany') !== -1) {
            this.expandContainsAnyRule(processedRule);
        }
        if (processedRule.toLowerCase().indexOf('containsall') !== -1) {
            this.expandContainsAllRule(processedRule);
        }
        if (processedRule.toLowerCase().indexOf('containsnone') !== -1) {
            this.expandContainsNoneRule(processedRule);
        }
        if (processedRule.toLowerCase().indexOf('answercount') !== -1) {
            this.expandAnswerCountRule(processedRule);
        }
        if (processedRule.toLowerCase().indexOf('isvisible') !== -1) {
            this.expandIsVisibleRule(processedRule);
        }

        // Replace operators and extract question identifiers
        processedRule = this.replaceOperators(processedRule);
        processedRule = this.extractQuestionIdentifiers(processedRule);

        return processedRule;
    }

    /**
     * Evaluate a parsed rule string
     * @param ruleString Evaluated rule without placeholders
     */
    protected evaluateRule(ruleString: string): boolean {
        try {
            const evaluationFunction = new Function(
                'return',
                `return ${ruleString};`,
            );

            // Capture the result, return it or false on error
            const result = evaluationFunction();
            return typeof result === 'boolean' ? result : false;
        } catch (e) {
            console.error('Rule evaluation error:', e);
            return false;
        }
    }

    /**
     * Extract question identifiers from rule string and prepare for value insertion
     */
    protected extractQuestionIdentifiers(ruleString: string): string {
        // Implementation would go here - similar to existing method
        return ruleString;
    }

    /**
     * Replace operators in rule (e.g., AND, OR)
     */
    protected replaceOperators(ruleString: string): string {
        // Implementation would go here
        return ruleString;
    }

    /**
     * Expand containsAny rule operator
     */
    private expandContainsAnyRule(ruleString: string): void {
        const re = /\s?(\w+)\.containsAny\((.*?)\)/gi;
        let matches;

        while (null !== (matches = re.exec(ruleString))) {
            const expandedString =
                '[' +
                this.escapeString(matches[2]).toLowerCase() +
                '].some(function (val) {return [%%' +
                this.escapeString(matches[1]) +
                '%%].indexOf(val) >= 0})';
            const wrapper = ' (' + expandedString + ') ';
            ruleString = ruleString.replace(matches[0], wrapper);
        }
    }

    /**
     * Expand containsAll rule operator
     */
    private expandContainsAllRule(ruleString: string): void {
        const re = /\s?(\w+)\.containsAll\((.*?)\)/gi;
        let matches;

        while (null !== (matches = re.exec(ruleString))) {
            const expandedString =
                '[' +
                this.escapeString(matches[2]).toLowerCase() +
                '].every(function (val) {return [%%' +
                this.escapeString(matches[1]) +
                '%%].indexOf(val) >= 0})';
            const wrapper = ' (' + expandedString + ') ';
            ruleString = ruleString.replace(matches[0], wrapper);
        }
    }

    /**
     * Expand containsNone rule operator
     */
    private expandContainsNoneRule(ruleString: string): void {
        const re = /\s?(\w+)\.containsNone\((.*?)\)/gi;
        let matches;

        while (null !== (matches = re.exec(ruleString))) {
            const expandedString =
                '[' +
                this.escapeString(matches[2]).toLowerCase() +
                '].every(function (val) {return [%%' +
                this.escapeString(matches[1]) +
                '%%].indexOf(val) == -1})';
            const wrapper = ' (' + expandedString + ') ';
            ruleString = ruleString.replace(matches[0], wrapper);
        }
    }

    /**
     * Expand answerCount rule operator
     */
    private expandAnswerCountRule(ruleString: string): void {
        const re = /\s?(\w+)\.answerCount\(\)(.*?)/gi;
        let matches;

        while (null !== (matches = re.exec(ruleString))) {
            const expandedString =
                '[%%' +
                this.escapeString(matches[1]) +
                '%%].length ' +
                matches[2];
            const wrapper = ' (' + expandedString + ') ';
            ruleString = ruleString.replace(matches[0], wrapper);
        }
    }

    /**
     * Expand isVisible rule operator
     */
    private expandIsVisibleRule(ruleString: string): void {
        const re = /\s?(\w+)\.isVisible\(\)/gi;
        // Implementation similar to containsAny - not shown for brevity
    }

    /**
     * Escape special characters in rule strings
     */
    protected escapeString(ruleString: string): string {
        ruleString = ruleString.replace(/__([^Q])/g, '_$1');
        ruleString = ruleString.replace(/_([^Q])/g, '__$1');
        return ruleString;
    }

    /**
     * Insert collected question values into the processed rule
     */
    protected insertQuestionValuesIntoRule(ruleString: string): string {
        for (const question in this.sourceQuestions) {
            if (!this.sourceQuestions.hasOwnProperty(question)) {
                continue;
            }

            const qData = this.sourceQuestions[question].join("','");

            if (qData.length) {
                const arrayQuestions = new RegExp(
                    '\\[%%' + question + '%%\\]',
                    'g',
                );
                ruleString = ruleString.replace(
                    arrayQuestions,
                    '[' + qData.toLowerCase() + ']',
                );

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
        }

        return ruleString;
    }

    /**
     * Get question values from DOM elements
     */
    protected getQuestionValues(): void {
        for (const question in this.sourceQuestions) {
            if (!this.sourceQuestions.hasOwnProperty(question)) {
                continue;
            }

            const sourceQuestion = this.sourceQuestions[question];
            let questionElements: NodeList | null = null;

            // Retrieve questions by container or group ID
            questionElements = document.querySelectorAll(
                `input[id][data-question-group$='${question}'], select[id][data-question-group$='${question}']`,
            );

            if (!questionElements.length) {
                questionElements = document.querySelectorAll(
                    `tr[data-question-group$='${question}'] input[id], tr[data-question-group$='${question}'] select[id]`,
                );
            }

            if (!questionElements.length) {
                console.warn(
                    'Could not find a question required by a visibility rule: ' +
                        question,
                );
                continue;
            }

            for (let j = 0; j < questionElements.length; j++) {
                const element = questionElements[j] as HTMLInputElement;
                const questionType = element.type;

                // Skip buttons or unchecked radio/checkboxes
                if (
                    questionType === 'button' ||
                    ((questionType === 'checkbox' ||
                        questionType === 'radio') &&
                        !element.checked)
                ) {
                    continue;
                }

                const questionValue = element.value;
                if (questionValue.length) {
                    sourceQuestion.push(questionValue);
                }
            }
        }
    }

    /**
     * Mark the processor as complete (no more changes expected)
     */
    protected markComplete(): void {
        this.visibilityIsComplete = true;
    }

    /**
     * Check if processor is complete
     */
    public isComplete(): boolean {
        return this.visibilityIsComplete;
    }

    /**
     * Clear collected question values
     */
    protected clearValues(): void {
        this.sourceQuestions = {};
        this.complexVisibilityRule = '';
        this.expandedVisibilityRule = '';
    }
}
