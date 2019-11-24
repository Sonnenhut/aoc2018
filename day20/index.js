import {fileAsText} from "../common/files.js";
import {EXAMPLE, Area} from "./day20_a.js";
import {EXAMPLE_23,EXAMPLE_31,EXAMPLE_18,} from "./day20_a.js";


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
            <svg height="500" width="500" viewBox="-50 -50 100 100"></svg>`;
        //const parsed = parse(EXAMPLE_23);
        //parsed.forEach(node => this.render(node))
        //allNodes(EXAMPLE_23).forEach(node => this.renderNode(node))
    }

    render(node) {
        const enlarge = 10;
        let svgNS = "http://www.w3.org/2000/svg";
        const svg = document.querySelector('svg');
        const toRender = [node];
        const rendered = [];
        while(toRender.length) {
            let curr = toRender.pop();
            (curr.prev || []).forEach(nextNode => {
                let line = document.createElementNS(svgNS, 'line');
                line.setAttribute( "x1", curr.x * enlarge);
                line.setAttribute( "y1", curr.y * enlarge);
                line.setAttribute( "x2", nextNode.x * enlarge);
                line.setAttribute( "y2", nextNode.y * enlarge);
                svg.append(line);
                //if(!rendered.filter(other => other.x === nextNode.x && other.y === nextNode.y).length) {
                if(!rendered.includes(nextNode)){
                    toRender.push(nextNode);
                    rendered.push(curr);
                }
            });
        }
    }

    renderNode(node) {
        const enlarge = 10;
        let svgNS = "http://www.w3.org/2000/svg";
        const svg = document.querySelector('svg');
        (node.prev || []).forEach(prev => {
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
