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

    constructor() {}

    public set balanceState(theState: boolean) {
        this.jsonBalance.state = theState;
    }

    public set oneSizeState(theState: boolean) {
        this.jsonOneSize.state = theState;
    }

    public set balanceMinWidth(theWidth: number) {
        this.jsonBalance.minWidth = theWidth || -1;
    }

    public set oneSizeMaxWidth(theWidth: number) {
        this.jsonOneSize.maxWidth = theWidth || -1;
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

    public render(): HTMLElement {
        // Create the <o-response> element
        const oResponse = document.createElement("o-response");
        oResponse.setAttribute("data-question-id", "_Q0");
        oResponse.setAttribute("data-question-group", "_QSingleline");

        // Set the JSON data-properties for <o-response>
        const properties = {
            labels: this.jsonlabels,
            balance: this.jsonBalance,
            oneSize: this.jsonOneSize,
        };
        oResponse.setAttribute("data-properties", JSON.stringify(properties));

        // Create the <o-singleline> element
        const mSingleline = document.createElement("m-singleline");
        mSingleline.setAttribute("type", this.subVariant);
        mSingleline.setAttribute("min", this.minValue.toString());
        mSingleline.setAttribute("max", this.maxValue.toString());
        mSingleline.setAttribute("step", this.stepValue.toString());
        mSingleline.setAttribute(
            "style",
            `width: ${this.inputWidth}; text-align: ${this.alignment.toLowerCase()};`
        );

        // Append <o-singleline> to <o-response>
        oResponse.appendChild(mSingleline);

        return oResponse;
    }
}
