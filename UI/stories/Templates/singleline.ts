/** */
 import OResponse from '../../src/javascript/web-components/o-response';
 import MSinglelineDate from '../../src/javascript/web-components/m-singleline-date';
 import MSinglelineNumber from '../../src/javascript/web-components/m-singleline-number';
 import MSingleline from '../../src/javascript/web-components/m-singleline';
 import OOptionSublist from '../../src/javascript/web-components/o-option-sublist';

/** */

export default class TSingleline extends HTMLElement {
    private jsonBalance = {"state":true, "minWidth":-1};
    private jsonOneSize = {"state":true, "maxWidth":-1};
    private jsonlabels = {"pre":"preLabel","post":"PostLabel"};

    private minValue = 1;
    private maxValue = 10;

    private stepValue = 1;
    private inputWidth = "";
    private alignment = "left";

    private subVariant:string = ""
    private specialCodeCount = 0;

    private oInput: MSingleline | MSinglelineDate | MSinglelineNumber;
    private oSpecial: OOptionSublist;


    constructor() {
        super();
    }

    private updateParentProperties() {
        const parentResponse = this.closest('o-response');
        if (parentResponse) {
            const properties = {
                labels: this.jsonlabels,
                balance: this.jsonBalance,
                oneSize: this.jsonOneSize,
            };
            parentResponse.setAttribute('data-properties', JSON.stringify(properties));
        }
    }

    public get specialCodes() : number {
        return this.specialCodeCount;
    }

    public get preLabel(): string {
        return this.jsonlabels.pre;
    }

    public get postLabel(): string {
        return this.jsonlabels.post;
    }
    
    public get balanceState(): boolean {
        return this.jsonBalance.state;
    }

    public get balanceMinWidth(): number {
        return this.jsonBalance.minWidth;
    }

    public get oneSizeState(): boolean {
        return this.jsonOneSize.state;
    }

    public get oneSizeBalance(): number {
        return this.jsonOneSize.maxWidth
    }

    public get minimum(): number {
        return this.minValue;
    }

    public get maximum(): number {
        return this.maxValue;
    }

    public get type(): string {
        return this.subVariant
    } 

    public get step(): number {
        return this.stepValue;
    }

    public get width(): string {
        return this.inputWidth;
    }

    public set specialCodes(theValue:number) {
        if (theValue < 0) {
            theValue = 0;
        }
        this.specialCodeCount = theValue;
    }

    public set balanceState(theState:boolean) {
        this.jsonBalance.state = theState;
        this.updateParentProperties();
    }

    public set oneSizeState(theState:boolean) {
        this.jsonOneSize.state = theState;
        this.updateParentProperties();
    }

    public set balanceMinWidth(theWidth:number) {
        if (!theWidth) {
            this.jsonBalance["minWidth"] = -1;
        }
        this.jsonBalance["minWidth"] = theWidth;
        this.updateParentProperties();
    }

    public set oneSizeMaxWidth(theWidth:number) {
        if (!theWidth) {
            this.jsonOneSize["maxWidth"] = -1;
        }
        this.jsonOneSize["maxWidth"] = theWidth;
        this.updateParentProperties();
    }   

    public set type (theType:string) {
        switch (theType) {
            case "number" :
            case "date" :
                this.subVariant = theType;
            default:
                this.subVariant = "";
        }
    }

    public set preLabel(theValue:string) {
        if (!theValue) {
            theValue = "";
        }
        this.jsonlabels.labels.pre = theValue;
        this.updateParentProperties();
    }

    public set postLabel(theValue:string) {
        if (!theValue) {
            theValue = "";
        }
        this.jsonlabels.labels.post = theValue;
        this.updateParentProperties();
    }

    public set minimum(value: number) {
        if (!value) {
            value = 1;
        }
        this.minValue = value;
    }

    public set maximum(value: number) {
        if (!value) {
            value = 1;
        }
        this.maxValue = value;
    }

    public set width(theValue: string) {
        if (!theValue) {
            theValue = "";
        }
        this.inputWidth = theValue;
    }

    public set step(theValue: number) {
        if (!theValue) {
            theValue = 1;
        }
        this.stepValue = theValue;
    }

    public set align(theValue: string) {
        if (!theValue) {
            theValue = "left";
        }
        this.alignment = theValue;
    }

    render() {
        this.innerHTML = ''; // Clear previous content
        switch (this.subVariant) {
            case "number":
                this.oInput = new MSinglelineNumber();
                break;
            case "date":
                this.oInput = new MSinglelineDate();
                break;
            default:
                this.oInput = new MSingleline();
                break;
        }
        if (this.specialCodeCount>0) {
            this.oSpecial = new OOptionSublist();
        }

    }
}
