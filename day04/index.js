import {fileAsText} from "../common/files.js";
import {parseGuards, parseLogEntries} from './day04_a.js'

class Day04 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        return fileAsText('day04/input.txt').then(input => {
            let guards = parseGuards(parseLogEntries(input));
            // sort them by getTotalNapMins
            guards = guards.sort((left, right) => left.getTotalNapMins() - right.getTotalNapMins()).reverse();
            const highlightedGuardId = guards[0].getId();
            return this.render(guards, highlightedGuardId);
        });
    }

    render(guards, highlightedGuardId) {
        this.innerHTML = '';
        const container = document.createElement('div');

        container.innerHTML +="<h2>--- Employee of the month ---</h2>";
        container.innerHTML +="<p>You may not shine as a star for Day 4, but you will always be remembered.<br/>For the highest amount minutes slept at work. &#127942</p>";
        guards.map(guard => {
            const isHighlighted = guard.getId() === highlightedGuardId;
            const textColorIncl = isHighlighted ? "color: ffff66" : "";
            const napTime = guard.getTotalNapMins();
            let row = document.createElement('div');

            let guardText = document.createElement('span');
            guardText.style = `display: inline-block; height: 1.2em; width: 3em; ${textColorIncl}`;
            guardText.innerText = `#${guard.getId()}`;
            row.appendChild(guardText);

            let bar = document.createElement('span');
            bar.style = `display: inline-block; background-color: white; height: 1.2em; width: ${napTime}`;
            row.appendChild(bar);

            //if(isHighlighted) {
                let amountSlept = document.createElement('span');
                amountSlept.style = `display: inline-block; height: 1.2em; width: 3em; ${textColorIncl}; white-space:nowrap;`;
                amountSlept.innerText = ` ${napTime} `;
                row.appendChild(amountSlept);
            //}

            return row;
        }).forEach(elem => container.appendChild(elem));
        container.innerHTML +="<p>[...]<br/>More than machinery we need humanity.<br>More than cleverness we need kindness and gentleness.<br>Without these qualities, life will be violent and all will be lost.<br/>[...]</p>";
        //container.innerHTML += "<p>We have developed speed, but we have shut ourselves in.<br>Machinery that gives abundance has left us in want.<br>Our knowledge has made us cynical.<br>Our cleverness, hard and unkind.<br>We think too much and feel too little.<br>More than machinery we need humanity.<br>More than cleverness we need kindness and gentleness.<br>Without these qualities, life will be violent and all will be lost...</p>";
        this.appendChild(container);
    }
}
customElements.define('day-04', Day04);