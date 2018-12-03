import {fileAsText} from "../common/files.js";
import {Claim, overwriteFabric} from "./day03_a.js";
import {solve as solve_b} from "./day03_b.js";



class Day03 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        fileAsText('day03/input.txt').then(input => {
            const highlightedClaimID = solve_b(input);
            const claims = input.split(/\r?\n|\n/g).map(text => Claim.parse(text));
            this.render(claims, highlightedClaimID);
        });
    }

    render(claims, highlightedClaimID) {
        this.innerHTML = '';
        let svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS,'svg');
        //svg.innerHTML += overlappingFilterDef + overlappingFilterStart;
        svg.setAttributeNS(null, "height", "999");
        svg.setAttributeNS(null, "width", "999");
        claims.map(claim => {
            const color = claim.id === highlightedClaimID ? "#00cc00" : "white";
            let rect = document.createElementNS(svgNS, 'rect');
            rect.setAttributeNS(null, "x", claim.x);
            rect.setAttributeNS(null, "y", claim.y);
            rect.setAttributeNS(null, "width", claim.w);
            rect.setAttributeNS(null, "height", claim.h);
            rect.setAttributeNS(null, "fill", color);
            return rect;
        }).forEach(rect => svg.appendChild(rect));
        this.appendChild(svg);
        //svg.innerHTML += overlappingFilterEnd;
    }
}
customElements.define('day-03', Day03);

// maybe try to 'shrink' the svg to fit the screen: https://css-tricks.com/scale-svg/
// try to show overlaps with a filter:
//https://stackoverflow.com/questions/38751756/what-is-the-best-approach-for-overlapping-svg-elements-area-fill
/*
const overlappingFilterDef = `
     <defs>
       <filter id="opacitychange">
         <feComponentTransfer>
           <feFuncA type="linear" intercept="-.05"/>
           </feComponentTransfer>
         <feComponentTransfer>
           <feFuncA type="gamma" amplitude="4" exponent=".4"/>
           </feComponentTransfer>
         </filter>
       </defs>`;
const overlappingFilterStart = "<g filter=\"url(#opacitychange)\">";
const overlappingFilterEnd = "</g>";
*/
/*
const overlappingFilterStart = "";
const overlappingFilterEnd = "";
const overlappingFilterDef = "";
*/