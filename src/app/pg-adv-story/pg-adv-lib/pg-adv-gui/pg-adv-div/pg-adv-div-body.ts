import { pgAdvDIVArea } from "./pg-adv-div-area";
import { pgAdvDIVCmdline } from "./pg-adv-div-cmdline";
import { pgAdvLinkTag, pgAdvLinkCmdAttr, pgAdvLibPushCmdOpts, pgAdvLinkEchoAttr, pgAdvLibPushCmd } from "../../pg-adv-lib-defs";

export type pgAdvBodyAddOptions = {classes?: string, container?: 'p'| 'div' | 'span'};

export const pgAdvBodyBufferDim = 16384;

export class pgAdvDIVBody extends pgAdvDIVArea {

    private _bufferDim: number;

    protected _textDIV       : pgAdvDIVArea;
    protected _cmdlineDIV    : pgAdvDIVCmdline;
    protected _advLinkClasses: string;
    
    resolveFunc: (value)=> any;

    constructor( 
        config: { 
            ID                : string, 
            body?             : string, 
            bodyClasses?      : string, 
            bodyHeight?       : string, 
            advLinkClasses?   : string, 
            inputRowClasses?  : string, 
            inputRowPrompt?   : string, 
            inputLabelClasses?: string, 
            inputClasses?     : string, 
            inputDIVClasses?  : string, 
            inputPlaceholder? : string,
            bufferDim?        : number, 
            quitBlock?        : string,
            quitCmdArr?       : string[],
        }) {
        super(config);

        this.element.innerHTML = `
            <div id="pg-adv-story-text"></div>
            <div id="pg-adv-story-cmdline"></div>
        `;

        this.element.className = config.bodyClasses;
        this.element['style'] = 'overflow-y: auto; height: ' + config.bodyHeight;

        this._textDIV = new pgAdvDIVArea({ID:'pg-adv-story-text'});
        this._cmdlineDIV = new pgAdvDIVCmdline({
            ID              :'pg-adv-story-cmdline', 
            rowClasses      : config.inputRowClasses,
            prompt          : config.inputRowPrompt,
            labelClasses    : config.inputLabelClasses,
            inputClasses    : config.inputClasses,
            inputDIVClasses : config.inputDIVClasses,
            placeholder     : config.inputPlaceholder,
        });

        this.content = config.body || '';
        this._advLinkClasses = config.advLinkClasses || '';
        this._bufferDim = config.bufferDim || pgAdvBodyBufferDim;

        window.onresize = ()=> { this.adjustScroll(); };
    }

    set content(s: string) {
        this._textDIV.content = s;
    }

    get content(): string {
        return this._textDIV.content;
    }

    clear() {
        this.content = '';
        this.adjustScroll();
    }

    add(content: string, options: pgAdvBodyAddOptions = { container: 'span' }) {

        let res = this.content || '';
        res += '<' + ((options.classes)?' class="' + options.classes + '"': '') + options.container + '>';
        res += content;
        res += '</' + options.container + '>';
   
        this.content = (res.length > this._bufferDim? res.slice(res.length - this._bufferDim): res);

        let list = this._textDIV.element.getElementsByTagName(pgAdvLinkTag);

        if (list.length>0) {
            for (let i = 0; i < list.length; i++) {
                const el = list[i];
                
                el.className = this._advLinkClasses;
                el['style'] = 'cursor: pointer';
                let cmd = el.getAttribute(pgAdvLinkCmdAttr) || el['innerText'];
                let opt: pgAdvLibPushCmdOpts = {};
                opt.echo = (el.getAttribute(pgAdvLinkEchoAttr)? (el.getAttribute(pgAdvLinkEchoAttr)=== 'true') : true);
                el['onclick'] = (event:MouseEvent) => { this._cmdlineDIV.pushCmd(cmd, this.resolveFunc, opt) };
            };
        }

        this.adjustScroll();
    }

    adjustScroll() {
        this._cmdlineDIV.adjustScroll();
    }

    loop(): Promise<pgAdvLibPushCmd> {
        return this._cmdlineDIV.waitCmd();
    }

    hideCmdline(h: boolean = true) {
        this._cmdlineDIV.hide(h);
    }
}
