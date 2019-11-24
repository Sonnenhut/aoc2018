import {fileAsText} from "../common/files.js";
import {Area} from "./day20_a.js";


class Day20 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = '';
        this.innerHTML += `
            <style>
                line {
                    stroke: white;
                    stroke-linejoin: bevel;
                    stroke-width: 0.05em;
                }
                rect:hover {
                    stroke: red;
                    stroke-dasharray: 1;
                }
                svg line{
                    transform: scaleY(-1);
                }
            </style>
            <svg height="1000" width="1000" viewBox="-800 -800 1500 1500"></svg>`;
        fileAsText('day20/input.txt').then(input => {
            const area = new Area(input);
            area.nodes.forEach(node => this.render(node));
        });
    }

    render(node) {
        const enlarge = 10;
        let svgNS = "http://www.w3.org/2000/svg";
        const svg = document.querySelector('svg');
        (node.next || []).forEach(prev => {
            let line = document.createElementNS(svgNS, 'line');
            line.setAttribute( "x1", node.x * enlarge);
            line.setAttribute( "y1", node.y * enlarge);
            line.setAttribute( "x2", prev.x * enlarge);
            line.setAttribute( "y2", prev.y * enlarge);
            svg.append(line);
        });
    }
}
customElements.define('day-20', Day20);
