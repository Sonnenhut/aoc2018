import {fileAsText} from "../common/files.js";
import {parse, EXAMPLE_DAY, solve} from './day10_a.js';

class Day10 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const coords = parse(EXAMPLE_DAY);
        this.startRender(solve(coords).snapshots);
    }

    // called by day10_b
    startRender(snapshots) {
        let idx = 0;
        // show last 100 snapshots
        let toShow = snapshots.slice(snapshots.length - 200);
        let interval = setInterval(() => {
            this.render(toShow[idx]);
            if(idx === toShow.length - 1) {
                clearInterval(interval);
            }
            idx++
        },50);
    }

    render(coords) {
        this.innerHTML = "";
        const minX = coords.map(coord => coord.x).min();
        const minY = coords.map(coord => coord.y).min();
        const maxX = coords.map(coord => coord.x).max();
        const maxY = coords.map(coord => coord.y).max();
        const offset = 10;
        // viewBox: min-x min-y widht height
        const viewBox = `${minX - offset} ${minY - offset} ${maxX - minX + (offset*2)} ${maxY - minY + (offset*2)}`;

        let svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS,'svg');
        svg.setAttributeNS(null, "height", "999");
        svg.setAttributeNS(null, "width", "999");
        svg.setAttributeNS(null, "viewBox", viewBox);
        coords.map(coord => {
            const color = "white";
            let dot = document.createElementNS(svgNS, 'rect');
            dot.setAttributeNS(null, "x", coord.x);
            dot.setAttributeNS(null, "y", coord.y);
            dot.setAttributeNS(null, "width", "1");
            dot.setAttributeNS(null, "height", "1");
            dot.setAttributeNS(null, "fill", color);
            return dot;
        }).forEach(elem => svg.appendChild(elem));
        this.appendChild(svg);
    }
}
customElements.define('day-10', Day10);

Array.prototype.max = function() {
    return this.reduce((max, curr) => max > curr ? max : curr);
};
Array.prototype.min = function() {
    return this.reduce((min, curr) => min < curr ? min : curr);
};