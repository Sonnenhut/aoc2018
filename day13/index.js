import {tick, findCrashLoc, parseState} from "./day13_a.js";
import {fileAsText} from "../common/files.js";

class Day13 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        fileAsText('day13/input.txt').then(input => {
            this.render(parseState(input)[0].inflated());
        });
        let el = document.getElementsByTagName('day-13');
        el[0].addEventListener("click", this.drawState.bind(this));
        document.addEventListener("keypress", this.drawState.bind(this));
    }

    // called each time B starts to look at a new dimension
    render(firstState) {
        this.state = firstState;


        for(let i=0; i < 30; i++) { //54
            //this.state = tick(this.state);
        }

        this.drawState();
    }

    drawState() {
        let preformatted = this.state.deflated().reduce((acc, row) => {
            const rowHtml = row.join('').replace(/([X<^>v])/g,"<span class='highlighted'>$1</span>");
            return acc + rowHtml + '<br>'
        }, "");
        this.innerHTML = `
                    <style>
                        .preformatted {
                            white-space: pre;
                            font-family: monospace;
                         }
                         .highlighted {
                            color: red;
                            font-weight: bold;
                         }
                    </style>
                     <h2>--- Press/hold any key or click to show the next tick ---</h2>           
                     <div class="preformatted">${preformatted}</div>`;
        this.state = tick(this.state);
    }
}
customElements.define('day-13', Day13);
