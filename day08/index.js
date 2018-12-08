import {fileAsText} from "../common/files.js";
import {parse} from './day08_a.js';

class Day08 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        return fileAsText('day08/input.txt').then(input => {
            return this.render(parse(input));

        });
    }

    render(node) {
        this.innerHTML += "<h2>--- Visual representation of nodes / children ---</h2>";

        const drawChildren = (nodes, parent, first = false) => {
            for(let node of nodes) {
                const elem = document.createElement('div');
                if(first) {
                    elem.style = "text-orientation: upright; writing-mode: vertical-lr;"
                }
                elem.style.display = 'inline-block';
                elem.style.margin = "10";
                elem.style.minHeight = "10";
                elem.style.minWidth = "10";
                elem.style.border = "0.001em solid white";
                //elem.style.backgroundColor = "white";
                elem.style.boxShadow = "0px 0px 15px 1px rgba(255,255,255,255.75)";
                parent.appendChild(elem);
                drawChildren(node.children, elem);
            }
        };
        drawChildren([node], this, true);
    }
}
customElements.define('day-08', Day08);