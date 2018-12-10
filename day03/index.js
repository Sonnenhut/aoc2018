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
        this.innerHTML += `<style>
                                rect {
                                    fill: white;
                                    stroke: black;
                                    stroke-linejoin: bevel;
                                    stroke-width: 0.05em;
                                }
                                rect:hover {
                                    fill: red;
                                    stroke-dasharray: 1;
                                }
                                rect#winner {
                                    fill: #00cc00;
                                }
                            </style>`;

        let svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS,'svg');
        //svg.innerHTML += overlappingFilterDef + overlappingFilterStart;
        svg.setAttribute( "height", "999");
        svg.setAttribute( "width", "999");
        claims.map(claim => {
            let rect = document.createElementNS(svgNS, 'rect');
            rect.setAttribute( "x", claim.x);
            rect.setAttribute( "y", claim.y);
            rect.setAttribute( "width", claim.w);
            rect.setAttribute( "height", claim.h);
            if(claim.id === highlightedClaimID) {
                rect.setAttribute("id", "winner");
            }
            return rect;
        }).forEach(rect => svg.appendChild(rect));
        this.appendChild(svg);
        //svg.innerHTML += overlappingFilterEnd;
    }
}
customElements.define('day-03', Day03);

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