import Component from './component';
import UAParser from 'ua-parser-js';

type StorageDestination = 'LocalStorage';
type ReadSource = 'UserAgent' | 'LocalStorage';

type UserAgentValue =
    | 'Browser'
    | 'BrowserVersion'
    | 'OperatingSystem'
    | 'OperatingSystemVersion'
    | 'Display';

interface WriteProps {
    destination: StorageDestination;
    name: string;
}

interface ReadProps {
    source: ReadSource;
    value: UserAgentValue | string;
}

/**
 * Atom: Hidden item for gathering/storing data
 */
export default class AReadWriteEdit extends Component {
    protected element: HTMLInputElement | null = null;

    private storageDestination: StorageDestination | '' = '';
    private storageName = '';
    private parser: UAParser;

    constructor() {
        super();
        this.parser = new UAParser();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'keyup':
            case 'change':
            case 'input':
            case 'restore':
                this.onChange();
                break;
        }
    }

    protected setElement(): void {
        // Prefer “component-local” element selection like other web-components do,
        // but keep a fallback for legacy markup where the input is outside the element.
        this.element =
            (this.querySelector('input') as HTMLInputElement | null) ??
            (document.querySelector(
                `input[data-questionid="${this.qid}"]`,
            ) as HTMLInputElement | null);
    }

    private hideQuestion(): void {
        if (!this.element) return;

        const container = this.element.closest(
            'o-question',
        ) as HTMLElement | null;

        if (!container) return;
        container.style.display = 'none';
    }

    // Public API (kept to match the old module’s behaviour)
    public write(props: WriteProps): void {
        this.storageDestination = props.destination;
        this.storageName = props.name;
        this.onChange(); // write current value immediately, like old writeInitialValue()
    }

    public read(props: ReadProps): void {
        if (!this.element) return;

        switch (props.source) {
            case 'UserAgent':
                this.element.value = this.readFromUserAgent(
                    props.value as UserAgentValue,
                );
                break;
            case 'LocalStorage':
                this.element.value = this.readFromLocalStorage(
                    String(props.value),
                );
                break;
        }

        // Writing the value into the input may need to trigger persistence too.
        this.onChange();
    }

    private onChange(): void {
        if (!this.element) return;
        if (!this.storageDestination.length) return;

        switch (this.storageDestination) {
            case 'LocalStorage':
                this.writeToLocalStorage();
                break;
            default:
                console.warn(
                    'AReadWriteEdit: attempted to write to an unsupported destination',
                    this.storageDestination,
                );
                break;
        }
    }

    private readFromUserAgent(value: UserAgentValue): string {
        switch (value) {
            case 'Browser':
                return this.detectBrowser();
            case 'BrowserVersion':
                return this.detectBrowserVersion();
            case 'OperatingSystem':
                return this.detectOS();
            case 'OperatingSystemVersion':
                return this.detectOSVersion();
            case 'Display':
                return this.detectDisplay();
            default:
                console.warn(
                    'AReadWriteEdit: requested unknown UserAgent value',
                    value,
                );
                return '';
        }
    }

    private readFromLocalStorage(key: string): string {
        return localStorage.getItem(key) ?? '';
    }

    private writeToLocalStorage(): void {
        if (!this.element) return;
        if (!this.storageName.length) return;

        localStorage.setItem(this.storageName, this.element.value);
    }

    private detectBrowser(): string {
        return this.parser.getBrowser().name ?? '';
    }

    private detectBrowserVersion(): string {
        return this.parser.getBrowser().version ?? '';
    }

    private detectOS(): string {
        return this.parser.getOS().name ?? '';
    }

    private detectOSVersion(): string {
        return this.parser.getOS().version ?? '';
    }

    private detectDisplay(): string {
        return `${screen.width}x${screen.height}`;
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.hideQuestion();

        // If this hidden input changes (programmatically or otherwise), persist it.
        this.element?.addEventListener('change', this);
        this.element?.addEventListener('keyup', this);
        this.element?.addEventListener('input', this);
        this.addEventListener('restore', this);
    }

    public disconnectedCallback(): void {
        this.element?.removeEventListener('change', this);
        this.element?.removeEventListener('keyup', this);
        this.element?.removeEventListener('input', this);
        this.removeEventListener('restore', this);
    }
}
