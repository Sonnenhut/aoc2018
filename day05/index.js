import {fileAsText} from "../common/files.js";
import {TRIGGERS} from './day05_a.js';

const immediatePromise = new Promise((resolve) => resolve());

class Day05 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        return fileAsText('day05/input.txt').then(input => {
            return this.render(input);
        });
    }

    render(input) {
        this.innerHTML = '';
        const challenge = document.createElement('div');
        challenge.style.wordWrap = "break-word";
        challenge.innerText = input;
        this.appendChild(challenge);

        // based on trying it out in an infinite loop
        const repeatTrigger = 4000;

        // directly show what solution B is doing and skip 't' (for my input)
        let prom = react('t', challenge).then(() => react('T', challenge));
        for(let i=0; i < repeatTrigger; i++) {
            for(let trigger of TRIGGERS) {
                prom = prom.then( () => {
                    return react(trigger, challenge);
                });
            }
        }
    }
}
customElements.define('day-05', Day05);

function react(trigger, element) {
    const search = new RegExp(trigger, 'g');
    const toDelete = `<span class="disappear" style="color: red">${trigger}</span>`;
    if(element.innerHTML.includes(trigger)) {
        element.innerHTML = element.innerHTML.replace(search, toDelete);

        return new Promise((resolve) => {
            setTimeout(() => {
                const disappearElements = document.getElementsByClassName('disappear');
                [...disappearElements].forEach(toDisappear => element.removeChild(toDisappear));
                resolve();
            }, 0);
        });
    } else {
        return immediatePromise;
    }
}
