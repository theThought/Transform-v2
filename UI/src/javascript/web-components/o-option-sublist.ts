import Component from './component';
import { Observer, Subject } from '../interfaces';
import { JsonObject } from './util';

interface CustomProperties extends JsonObject {
    balance: {
        state: boolean;
        minwidth: string;
    };
    onesize: {
        state: boolean;
        maxwidth: string;
    };
    tabstrip: {
        question: string;
        tab: string;
    };
    sublistline: {
        state: boolean;
        length: number;
    };
}

export default class OOptionSublist
    extends Component
    implements Subject, Observer
{
    protected observers: Observer[] = [];
    protected properties: CustomProperties = {
        balance: {
            state: false,
            minwidth: '',
        },
        onesize: {
            state: false,
            maxwidth: '',
        },
        tabstrip: {
            question: '',
            tab: '',
        },
        sublistline: {
            state: false,
            length: 100,
        },
    };

    public tallest = 0;
    public widest = 0;
    public maxwidth = 0;

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'exclusiveSelected':
                this.exclusiveSelected(e as CustomEvent);
                break;
            case 'broadcastChange':
                this.handleChange(e as CustomEvent);
                break;
        }
    }

    private exclusiveSelected(e: CustomEvent): void {
        if (
            this.isExclusive &&
            this.contains(e.target as Node) &&
            this.isNonExclusiveOption(e)
        )
            return;

        this.notifyObservers('clearOtherValues', e);
    }

    private isNonExclusiveOption(e: CustomEvent): boolean {
        const source = e.detail as {
            dataset?: DOMStringMap;
            getExclusive?: () => boolean;
        };

        return (
            typeof source.dataset?.checked !== 'undefined' &&
            source.getExclusive?.() !== true
        );
    }

    private handleChange(e: CustomEvent): void {
        const source = e.detail as {
            dataset?: DOMStringMap;
            getExclusive?: () => boolean;
        };

        if (source.dataset?.checked === 'false') return;

        const isExclusiveOption = source.getExclusive?.() === true;

        this.notifyObservers('clearExclusiveOptions', e);

        if (
            this.isExclusive &&
            source.dataset?.checked === 'true' &&
            !isExclusiveOption
        ) {
            const exclusiveSelected = new CustomEvent('exclusiveSelected', {
                bubbles: true,
                detail: e.detail,
            });

            // Keep the original option as the event target so observers can
            // exclude the selected option while clearing its siblings.
            e.target?.dispatchEvent(exclusiveSelected);
        }
    }

    public update(method: string, data: CustomEvent): void {
        switch (method) {
            case 'clearExclusiveOptions':
                if (this.contains(data.target as HTMLElement)) return;
                if (this.isExclusive) {
                    this.notifyObservers('clearOtherValues', data);
                }
                this.handleChange(data);
                break;
            case 'clearOtherValues':
                if (
                    this.isExclusive &&
                    this.contains(data.target as Node) &&
                    this.isNonExclusiveOption(data)
                )
                    return;
                this.notifyObservers('clearOtherValues', data);
                break;
            case 'exclusiveSelected':
                this.notifyObservers('exclusiveSelected', data);
                break;
            case 'clearValue':
                if (this.contains(data.target as HTMLElement)) return;
                this.notifyObservers('clearValue', data);
                break;
            case 'resizeMessage':
                this.handleResizeFromExternalSource(data);
                break;
        }
    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        const obsIndex = this.observers.findIndex(
            (obs: Observer): boolean => observer === obs,
        );

        if (obsIndex < 0) {
            console.error('Observer does not exist!');
            return;
        }

        this.observers.splice(obsIndex, 1);
    }

    public notifyObservers(method: string, detail: CustomEvent): void {
        for (const observer of this.observers) {
            observer.update(method, detail);
        }
    }

    private setBalance(): void {
        if (this.properties.balance.state) {
            this.classList.add('balance');
        } else {
            this.classList.remove('balance');
        }
    }

    private handleResizeFromExternalSource(data: CustomEvent): void {
        if (data.detail.width) this.checkOnesize(data.detail.width, 0);
        if (data.detail.height) this.checkOnesize(0, data.detail.height);
    }

    public checkOnesize(width: number, height: number): void {
        if (
            width > this.widest &&
            (this.maxwidth === 0 || width <= this.maxwidth)
        ) {
            this.widest = width;
            const event = new CustomEvent('sizeChange', {
                detail: { width: width },
            });
            this.notifyObservers('sizeChangeWidth', event);
            this.response?.forwardResizeMessage(width, null);
        }

        if (height > this.tallest) {
            this.tallest = height;
            const e = new CustomEvent('sizeChange', {
                detail: { height: height },
            });
            this.notifyObservers('sizeChangeHeight', e);
            this.response?.forwardResizeMessage(null, height);
        }
    }

    private addSeparatorLine(): void {
        if (!this.properties.sublistline?.state) return;
        const fieldset = this.closest('fieldset');
        if (!fieldset) return;
        const lineLength = this.properties.sublistline.length ?? 100;
        fieldset.classList.add('separator');
        fieldset.style.setProperty('--border-length', `${lineLength}%`);
    }

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.response) this.response.addObserver(this);

        this.addEventListener('exclusiveSelected', this.handleEvent);
        this.addEventListener('broadcastChange', this.handleEvent);
        this.setBalance();
        this.addSeparatorLine();
    }
}
