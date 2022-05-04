import { pgAdvDIVArea } from "./pg-adv-div-area";
import { pgAdvDIVCmdline } from "./pg-adv-div-cmdline";
import { pgAdvLibLinkTag, pgAdvLibLinkCmdAttr, pgAdvLibPushCmdOpts, pgAdvLibLinkEchoAttr, pgAdvLibPushCmd, pgAdvHTMLTag, pgAdvLibLinkDelAttr, pgAdvLibItemsData } from "../../pg-adv-lib-defs";
import { pgAdvFloatMenu } from "./pg-adv-gui-floatmenu";

export type pgAdvBodyAddOptions = {classes?: string, tag?: pgAdvHTMLTag};

export const pgAdvBodyBufferDim = 16384;

export class pgAdvDIVBody extends pgAdvDIVArea {

    private _bufferDim: number;

    protected _textDIV       : pgAdvDIVArea;
    protected _cmdlineDIV    : pgAdvDIVCmdline;
    protected _advLinkClasses: string;
    protected _floatMenu     : pgAdvFloatMenu;
    
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
        this.element.style.overflowY = 'auto'; 
        this.element.style.height = config.bodyHeight;

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

        this._floatMenu = new pgAdvFloatMenu({
            ID: 'pgadv-floating-menu-container'
        });

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

    protected _prepareContent(content: string, options: pgAdvBodyAddOptions) {
        let res = '';
        res = this.content || '';
        res += '<' + options.tag + ((options.classes)?' class="' + options.classes + '"': '') + '>';
        res += content;
        res += '</' + options.tag + '>';

        this.content = (res.length > this._bufferDim? res.slice(res.length - this._bufferDim): res);
    }

    protected _insertAdvLinks() {
        let list = this._textDIV.element.getElementsByTagName(pgAdvLibLinkTag);

        if (list.length>0) {
            for (let i = 0; i < list.length; i++) {
                const el = list[i];
                
                el.className = this._advLinkClasses;
                el['style'] = 'cursor: pointer';
                let cmd = el.getAttribute(pgAdvLibLinkCmdAttr) || el['innerText'];
                let opt: pgAdvLibPushCmdOpts = {};
                
                opt.echo = (el.getAttribute(pgAdvLibLinkEchoAttr)? (el.getAttribute(pgAdvLibLinkEchoAttr)=== 'true') : true);
                
                cmd = JSON.parse(cmd.startsWith('[') ? cmd: '["' + cmd + '"]');                
                cmd = cmd.length>1? cmd:cmd[0];
                
                if(!Array.isArray(cmd)) el['onclick'] = (event:MouseEvent) => { this._cmdlineDIV.pushCmd(cmd, this.resolveFunc, opt) };
                else el['onclick'] = (event:MouseEvent) => {
                    this._floatMenu.onClick({event, data: cmd, onClick: (data: pgAdvLibItemsData)=> {
                        this._cmdlineDIV.pushCmd(data.value, this.resolveFunc, opt);
                    }
                })};
            };
        }    
    }

    removeAdvLinks() {
        let elements = this._textDIV.element.getElementsByTagName(pgAdvLibLinkTag);

        if(elements) {
            let list = [];
            for (let i = 0; i < elements.length; i++) {
                list.push(elements.item(i));
            }
            list.forEach(el => {
                let par = el.parentNode;
                let save = ((el.getAttribute(pgAdvLibLinkDelAttr)=== 'false')||(el.getAttribute(pgAdvLibLinkDelAttr)==null));

                if((el.firstChild)&&(save)) par.insertBefore(el.firstChild, el);
                par.removeChild(el);
            })
        }
    }


    add(content: string, options: pgAdvBodyAddOptions = { tag: 'span' }) {

        this._prepareContent(content, options);
        this._insertAdvLinks();

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

    get isHiddenCmdline(): boolean {
        return this._cmdlineDIV.hidden;
    }
}
