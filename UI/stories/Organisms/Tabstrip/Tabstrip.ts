import { MOptionTab } from '../../Molecules/Option/tab';

export function OTabstrip(args): HTMLElement {
    const component: HTMLElement = document.createElement('o-option-tabstrip');
    const option = MOptionTab;

    for (let i = 0; i < args.numberOfTabs; i++) {
        const clonedArgs = { ...args };
        clonedArgs.optionLabel = `${args.optionLabel} ${i + 1}`;
        component.appendChild(option(clonedArgs));
    }

    return component;
}
