export interface Observer {
    update(method: string, detail: CustomEvent | Event | string): void;
}

export interface Subject {
    addObserver(observer: Observer): void;

    removeObserver(observer: Observer): void;

    notifyObservers(method: string, detail: CustomEvent | Event | string): void;
}
