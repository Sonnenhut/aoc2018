import {parseScan} from "./day17_a.js";
import {fileAsText} from "../common/files.js";

class Day17 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        fileAsText('day17/input.txt').then(input => {
            let world = parseScan(input);
            world.initBoundaries();
            world.pour(500, 1);
            this.render(world);
        });
    }

    render(world) {
        let pre = [];
        for(let col=0; col < world.w.length; col++) {
            let column = world.w[col] || [];
            for(let row=0; row < 2000; row++) {
                if(column && column[row]) {
                    if(!pre[row]) {pre[row] = []}
                    pre[row][col] = column[row]
                } else {
                    if(!pre[row]) {pre[row] = []}
                    pre[row][col] = ' ';
                }
            }
        }

        pre = pre.reduce((acc, row) => { return acc + '\n' + row.join(' ') }, "");

        this.drawState(pre);
    }

    drawState(preformatted) {
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
                     <div class="preformatted">${preformatted}</div>`;
    }
}
customElements.define('day-17', Day17);
