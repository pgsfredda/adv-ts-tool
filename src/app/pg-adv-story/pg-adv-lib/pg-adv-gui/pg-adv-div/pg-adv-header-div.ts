import { pgAdvDIVArea } from "./pg-adv-div-area";

export class pgAdvHeaderDIV extends pgAdvDIVArea {

    titleDIV  : pgAdvDIVArea;
    scorerDIV : pgAdvDIVArea;
    infosDIV  : pgAdvDIVArea;

    constructor(config: { 
        ID            : string, 
        headerClasses?: string,
        title?        : string, 
        titleClasses? : string,
        scorer?       : string, 
        scorerClasses?: string, 
        infos?        : string, 
        infosClasses? : string, 
        line1Classes? : string,
        line2Classes? : string,
    }) {
        super(config);

        this.element.innerHTML = `
            <div id="line-1">
                <div id="title"></div>
                <div id="scorer"></div>
            </div>
            <div id="line-2">
                <div id="infos"></div>
            </div>
        `;

        this.element.className = config.headerClasses || '';

        let line1 = this.element.getElementsByTagName('div').namedItem('line-1');
        this.titleDIV = new pgAdvDIVArea({ID: 'title'});
        this.scorerDIV = new pgAdvDIVArea({ID: 'scorer'});
        let line2 = this.element.getElementsByTagName('div').namedItem('line-2');
        this.infosDIV = new pgAdvDIVArea({ID: 'infos'});

        line1.className = config.line1Classes || '';
        line2.className = config.line2Classes || '';

        this.titleDIV.element.className = config.titleClasses || '';
        this.titleDIV.content = config.title || '';
        this.scorerDIV.element.className = config.scorerClasses || '';
        this.scorerDIV.content = config.scorer || '';
        this.infosDIV.element.className = config.infosClasses || '';
        this.infosDIV.content = config.infos || '';
    }

    set content(s: string) {
        this.infosDIV.content = s;
    }

    get content(): string {
        return this.infosDIV.content;
    }

    set title(s: string) {
        this.titleDIV.content = s;
    }

    get title(): string {
        return this.titleDIV.content;
    }

    set scorer(s: string) {
        this.scorerDIV.content = s;
    }

    get scorer(): string {
        return this.scorerDIV.content;
    }

    set infos(s: string) {
        this.infosDIV.content = s;
    }

    get infos(): string {
        return this.infosDIV.content;
    }

}