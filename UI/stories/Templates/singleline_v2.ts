import OResponse from '../../src/javascript/web-components/o-response';
import MSingleline from '../../src/javascript/web-components/m-singleline';

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

    private elementResponse: OResponse;
    private elementSingleline: MSingleline;;
    private elementPreLabel: HTMLSpanElement;
    private elementPostLabel: HTMLSpanElement;
    private elementInput: HTMLInputElement;

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