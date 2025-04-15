/** */
import OResponse from '../../src/javascript/web-components/o-response';
import MSinglelineDate from '../../src/javascript/web-components/m-singleline-date';
import MSinglelineNumber from '../../src/javascript/web-components/m-singleline-number';
import MSingleline from '../../src/javascript/web-components/m-singleline';
import OOptionSublist from '../../src/javascript/web-components/o-option-sublist';

/** */

export default class TSingleline {
    private jsonBalance = { state: true, minWidth: -1 };
    private jsonOneSize = { state: true, maxWidth: -1 };
    private jsonlabels = { pre: "preLabel", post: "PostLabel" };

    private minValue = 1;
    private maxValue = 10;
    private stepValue = 1;
    private inputWidth = "";
    private alignment = "left";
    private subVariant: string = "";
    private specialCodeCount = 0;

    private elementResponse: HTMLElement;
    private elementSingleline: HTMLElement;
    private elementPreLabel: HTMLSpanElement;
    private elementPostLabel: HTMLSpanElement;
    private elementInput: HTMLInputElement;

    constructor() {}

    public set balanceState(theState: boolean) {
        this.jsonBalance.state = theState;
        this.updateProperties();
    }

    public set oneSizeState(theState: boolean) {
        this.jsonOneSize.state = theState;
        this.updateProperties();
    }

    public set balanceMinWidth(theWidth: number) {
        this.jsonBalance.minWidth = theWidth || -1;
        this.updateProperties
    }

    public set oneSizeMaxWidth(theWidth: number) {
        this.jsonOneSize.maxWidth = theWidth || -1;
        this.updateProperties();
    }

    public set type(theType: string) {
        this.subVariant = ["number", "date"].includes(theType) ? theType : "text";
    }

    public set preLabel(theValue: string) {
        this.jsonlabels.pre = theValue || "";
    }

    public set postLabel(theValue: string) {
        this.jsonlabels.post = theValue || "";
    }

    public set minimum(value: number) {
        this.minValue = value || 1;
    }

    public set maximum(value: number) {
        this.maxValue = value || 1;
    }

    public set width(theValue: string) {
        this.inputWidth = theValue || "";
    }

    public set align(theValue: string) {
        this.alignment = theValue || "left";
    }

    public set responseHTML(theValue: HTMLElement) {
        this.elementResponse = theValue
    }

    public set singlelineHTML(theValue: HTMLElement) {
        this.elementSingleline = theValue;
    }

    private updateProperties() {
    var newJSON = {labels: {}, balance: {}, oneSize: {}};
        if (!this.elementResponse) {
            return;
        }
        newJSON.balance = this.jsonBalance;
        newJSON.oneSize = this.jsonOneSize;
        newJSON.labels = this.jsonlabels;

        this.elementResponse.setAttribute("data-properties", JSON.stringify(newJSON));
    }

    public setupStory() {
        this.elementResponse.setAttribute("data-question-group", "_QSingleline");
        this.elementResponse.setAttribute("data-position", "below");

        this.elementSingleline.setAttribute("data-question-group", "_QSingleline");
        this.elementSingleline.setAttribute("data-question-id", "_Q0");

        this.elementPreLabel = document.createElement('span');
        this.elementInput = document.createElement('input');
        this.elementPostLabel = document.createElement('span');
        this.elementInput.setAttribute("data-question-group","_QSingleline");
        this.elementInput.setAttribute("data-hidden", "false");

        this.elementPreLabel.setAttribute("class", "a-label-pre")
        this.elementPostLabel.setAttribute("class", "a-label-post")
        this.elementInput.setAttribute("class", "a-Singleline");
        this.elementInput.setAttribute("name", "_QSingleline");
        this.elementInput.setAttribute("id", "_Q0");

        this.elementSingleline.appendChild(this.elementInput);
        this.elementSingleline.appendChild(this.elementPreLabel);
        this.elementSingleline.appendChild(this.elementPostLabel);

        this.elementInput.setAttribute("type", this.subVariant);
        this.elementInput.setAttribute("min", this.minValue.toString());
        this.elementInput.setAttribute("max", this.maxValue.toString());
        this.elementInput.setAttribute("step", this.stepValue.toString());
        this.elementInput.setAttribute(
            "style",
            `width: ${this.inputWidth}; text-align: ${this.alignment.toLowerCase()};`
        );
        this.updateProperties();
    }
}
