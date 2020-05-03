import { pgAdvDIVArea } from "./pg-adv-div-area";

export class pgAdvDIVFooter extends pgAdvDIVArea {

    constructor(config: { ID: string, footer?: string, footerClasses?: string }) {
        super(config);

        this.element.className = config.footerClasses || '';
        this.content = config.footer || '';
    }
}