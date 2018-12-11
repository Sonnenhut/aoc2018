class Day11 extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render(0);
    }

    // called each time B starts to look at a new dimension
    render(progress) {
        if(this.elementsCreated) {
            const progressEl = this.querySelector('progress');
            if(progressEl) {
                progressEl.value = `${progress}`;
            }
        } else {
            const headEl = document.createElement('H2');
            headEl.innerText = "--- Takes forever, take this progress bar (that will not update at all) ---";
            this.appendChild(headEl);

            const progressEl = document.createElement('progress');
            progressEl.max = "300";
            progressEl.value = `${progress}`;
            this.appendChild(progressEl);

            this.elementsCreated = true;
        }
        setTimeout(function(){}, 0)
    }
}
customElements.define('day-11', Day11);
