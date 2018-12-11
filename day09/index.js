import {Marble, Circle} from './day09_a.js';

//http://jsfiddle.net/leaverou/zXPzY/?utm_source=website&utm_medium=embed&utm_campaign=zXPzY

class Day09 extends HTMLElement {
    constructor() {
        super();
        let circle = new Circle([0,1],2,1);
        for(let i = 0; i < 21; i++) {
            Circle.placeNextMarbleClockwise(circle);
        }
        this.render(circle._marble);
    }

    render(marble) {
        let count = countMarbles(marble);
        const step = (360 / count);
        let generatedCSS = "";
        let generatedHTML = "";
        for(let i = 0; i < 360; i += step) {
            const id = "id" + marble.self;
            generatedCSS += rotatedCss(id,i);
            //generatedHTML += `<div id="${id}"><div>${marble.self}</div></div>`;
            generatedHTML += `<div id="${id}"><div>${marble.self}</div></div>`;
            marble = marble.cw;
        }
        //TODO revisit this. it's not showing a circle
        this.innerHTML = "<h2>--- Should revisit this, it should be a circle ---</h2>";
        this.innerHTML +=  `
        <style>           
            ${generatedCSS} 
        </style>
        ${generatedHTML}
        `;


    }
}
customElements.define('day-09', Day09);

const rotatedCss = (id,deg) => {
    return `
        day-09 > div#${id} {
            width: 30px;
            height: 3px;
            margin: auto;
            font-size: 2em;
            transform: rotate(${deg}deg);
            transform-origin:50% 200px;
            border: 1px solid black;
        }
        day-09 > div#${id} > div {
            border: 1px solid black;
            transform: rotate(-${deg}deg);
        }
        `;
};

function countMarbles(marble) {
    let res = 1;
    let tmpMarble = marble.cw;
    while(tmpMarble.self !== marble.self) {
        tmpMarble = tmpMarble.cw;
        res++;
    }
    return res;
}
