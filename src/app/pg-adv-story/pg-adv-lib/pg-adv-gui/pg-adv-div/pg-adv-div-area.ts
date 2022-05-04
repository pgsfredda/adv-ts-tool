export class pgAdvDIVArea {
    ID     : string;
    element: HTMLElement;

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
        this.element.style.display = (h? 'none' : 'block');
    }

    get hidden(): boolean {
        return (this.element.style.display === 'none')
    }

    disable(d: boolean = true) {
        this.element.setAttribute('disabled', (d? 'true' : undefined));
    }
}