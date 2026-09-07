/** Shared visibility rule parser and evaluator. */
export default class VisibilityRulesProcessor {
    private sourceQuestions: Record<string, string[]> = {};

    public parseVisibilityRules(ruleString: string): string {
        if (!ruleString) return '';

        let processedRule = ruleString;

        processedRule = this.expandCollectionRule(
            processedRule,
            'containsAny',
            'some',
            '>= 0',
        );

        processedRule = this.expandCollectionRule(
            processedRule,
            'containsAll',
            'every',
            '>= 0',
        );

        processedRule = this.expandCollectionRule(
            processedRule,
            'containsNone',
            'every',
            '== -1',
        );

        processedRule = this.expandAnswerCountRule(processedRule);
        processedRule = this.expandIsVisibleRule(processedRule);
        processedRule = this.replaceOperators(processedRule);
        return this.extractQuestionIdentifiers(processedRule);
    }

    public evaluateRule(ruleString: string): boolean {
        try {
            return Boolean(new Function(`return ${ruleString}`)());
        } catch (error) {
            console.error('Rule evaluation error:', error);
            return false;
        }
    }

    public getQuestionValues(): void {
        Object.keys(this.sourceQuestions).forEach((question) => {
            this.sourceQuestions[question] = [];
            let elements = document.querySelectorAll<HTMLElement>(
                `input[id][data-question-group$='${question}'], select[id][data-question-group$='${question}']`,
            );
            if (!elements.length) {
                elements = document.querySelectorAll<HTMLElement>(
                    `tr[data-question-group$='${question}'] input[id], tr[data-question-group$='${question}'] select[id], div[data-question-group$='${question}'] input[id], div[data-question-group$='${question}'] select[id]`,
                );
            }
            if (!elements.length) {
                console.warn(
                    'Could not find a question required by a visibility rule: ' +
                        question,
                );
                return;
            }
            elements.forEach((element) => {
                const input = element as HTMLInputElement;
                if (
                    input.type === 'button' ||
                    ((input.type === 'checkbox' || input.type === 'radio') &&
                        !input.checked)
                )
                    return;
                if (input.value.length)
                    this.sourceQuestions[question].push(input.value);
            });
        });
    }

    public insertQuestionValuesIntoRule(ruleString: string): string {
        Object.keys(this.sourceQuestions).forEach((question) => {
            const values = this.sourceQuestions[question];
            const qData = values.length
                ? "'" + values.join("','").toLowerCase() + "'"
                : '';
            ruleString = ruleString.replace(
                new RegExp(`\\[%%${question}%%\\]`, 'g'),
                `[${qData}]`,
            );
            ruleString = ruleString.replace(
                new RegExp(`%%${question}%%`, 'g'),
                qData || "''",
            );
        });
        return ruleString;
    }

    private escapeString(value: string): string {
        return value.replace(/__([^Q])/g, '_$1').replace(/_([^Q])/g, '__$1');
    }

    private expandCollectionRule(
        ruleString: string,
        operator: string,
        method: string,
        comparison: string,
    ): string {
        const re = new RegExp(`\\s?(\\w+)\\.${operator}\\((.*?)\\)`, 'gi');
        let matches: RegExpExecArray | null;
        while ((matches = re.exec(ruleString)) !== null) {
            const expanded = `[${this.escapeString(matches[2]).toLowerCase()}].${method}(function (val) {return [%%${this.escapeString(matches[1])}%%].indexOf(val) ${comparison}})`;
            ruleString = ruleString.replace(matches[0], ` (${expanded}) `);
        }
        return ruleString;
    }

    private expandAnswerCountRule(ruleString: string): string {
        const re = /\s?(\w+)\.answerCount\(\)(.*?)/gi;
        let matches: RegExpExecArray | null;
        while ((matches = re.exec(ruleString)) !== null) {
            ruleString = ruleString.replace(
                matches[0],
                ` ([%%${this.escapeString(matches[1])}%%].length ${matches[2]}) `,
            );
        }
        return ruleString;
    }

    private expandIsVisibleRule(ruleString: string): string {
        const re = /\s?(\w+)\.isVisible\(\)/gi;
        let matches: RegExpExecArray | null;
        while ((matches = re.exec(ruleString)) !== null) {
            const expanded = `!document.querySelector('o-response[data-question-group*="${this.escapeString(matches[1])}"]').classList.contains('unavailable')`;
            ruleString = ruleString.replace(matches[0], ` (${expanded}) `);
        }
        return ruleString;
    }

    private replaceOperators(ruleString: string): string {
        const questionRe = /\s?([a-zA-Z0-9_]+)\s([=<>+-]+)/g;
        return ruleString
            .replace(/or /gi, '|| ')
            .replace(/and /gi, '&& ')
            .replace(/%gt%/g, '>')
            .replace(/%lt%/g, '<')
            .replace(questionRe, ' %%$1%% $2 ')
            .replace(/[^=!<>*]=[^=]/g, '==');
    }

    private extractQuestionIdentifiers(ruleString: string): string {
        const questionRe = /%%(\w+)%%/g;
        const questions = [...new Set(ruleString.match(questionRe) ?? [])];
        questions.forEach((questionToken) => {
            const currentQuestion = questionToken.replace(questionRe, '_Q$1');
            this.sourceQuestions[currentQuestion] = [];
            ruleString = ruleString.replace(
                new RegExp(questionToken, 'g'),
                `%%${currentQuestion}%%`,
            );
        });
        return ruleString;
    }
}
