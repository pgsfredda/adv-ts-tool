export class pgAdvDIVArea {
    ID     : string;
    element: Element;

    constructor(config: { ID: string }) {
        this.ID = config.ID;

        this.init();
    }

    init() {
        this.element = document.getElementById(this.ID);
    }

    set content(s: string) {
        this.element.innerHTML = s;
    }

    get content(): string {
        return this.element.innerHTML;
    }

    clear(content: string = '') {
        this.content = content;
    }

    hide(h: boolean = true) {
        this.element['style'] = 'display: ' + (h? 'none' : 'block'); 
    }

    disable(d: boolean = true) {
        this.element['disabled'] = (d? 'true' : undefined); 
    }
}