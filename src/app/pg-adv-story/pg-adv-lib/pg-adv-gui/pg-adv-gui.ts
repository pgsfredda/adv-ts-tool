import { pgAdvDIVArea } from "./pg-adv-div/pg-adv-div-area";
import { pgAdvHeaderDIV } from "./pg-adv-div/pg-adv-header-div";
import { pgAdvDIVBody, pgAdvBodyAddOptions } from "./pg-adv-div/pg-adv-div-body";
import { pgAdvDIVFooter } from "./pg-adv-div/pg-adv-div-footer";
import { pgAdvDIVConfig } from "./pg-adv-div/pg-adv-div-config";
import { pgAdvLibText, pgAdvLibPushCmd, pgAdvLibString, pgAdvLibLinkCmdAttr, pgAdvLibLinkEchoAttr, pgAdvLibLinkDelAttr, pgAdvLibLinkData } from "../pg-adv-lib-defs";
import { pgAdvApp } from "../../../pg-adv-app";
import { getAdvLink } from "../pg-adv-utils";

export class pgAdvGUI {
    protected _loaderDIV: pgAdvDIVArea;
    protected _storyDIV : pgAdvDIVArea;

    protected _headerDIV: pgAdvHeaderDIV;
    protected _bodyDIV  : pgAdvDIVBody;
    protected _footerDIV: pgAdvDIVFooter;

    protected _errorMessage: string;
    protected _errorClasses: string;

    constructor(
        protected _advApp: pgAdvApp,
    ) {};

    setup(divConfig: pgAdvDIVConfig) {

        this._errorClasses = divConfig.errorClasses || '';
        this._errorMessage = divConfig.errorMessage || '';

        document.body.innerHTML = `
            <div id="pg-adv-loader"></div>
            <div id="pg-adv-story"></div>
        `;

        this._loaderDIV = new pgAdvDIVArea({ID: 'pg-adv-loader'});
        this._storyDIV = new pgAdvDIVArea({ID: 'pg-adv-story'});

        this._storyDIV.content = `
            <div id="pg-adv-story-header"></div>
            <div id="pg-adv-story-body"></div>
            <div id="pg-adv-story-footer"></div>
            <div id="pg-adv-copy"></div>
        `;

        this._loaderDIV.element.className = divConfig.loaderDIVClasses;
        this._loaderDIV.content = divConfig.loaderDIVContent;
        
        this._storyDIV.element.className = divConfig.storyDIVClasses;

        this._headerDIV = new pgAdvHeaderDIV({
            ID           : 'pg-adv-story-header', 
            titleClasses : divConfig.headerDIVTitleClasses,
            scorerClasses: divConfig.headerDIVScorerClasses,
            infosClasses : divConfig.headerDIVInfosClasses,
            line1Classes : divConfig.headerDIVLine1Classes,
            line2Classes : divConfig.headerDIVLine2Classes,
        });
        
        this._bodyDIV = new pgAdvDIVBody({
            ID               : 'pg-adv-story-body', 
            bodyClasses      : divConfig.bodyDIVClasses,
            bodyHeight       : divConfig.bodyDIVHeight,
            advLinkClasses   : divConfig.advLinkClasses,
            inputRowClasses  : divConfig.inputRowClasses,
            inputRowPrompt   : divConfig.inputRowPrompt,
            inputLabelClasses: divConfig.inputLabelClasses,
            inputClasses     : divConfig.inputClasses,
            inputDIVClasses  : divConfig.inputDIVClasses,
            inputPlaceholder : divConfig.inputPlaceholder,
        });

        this._footerDIV = new pgAdvDIVFooter({
            ID           : 'pg-adv-story-footer', 
            footerClasses: divConfig.footerDIVClasses
        });

        let copy = this._storyDIV.element.getElementsByTagName('div').namedItem('pg-adv-copy');
        copy.innerHTML =  '<p><small>adv TS tool is a <a href="http://creativaweb.it" target="_blank">creativaweb</a> production by <a href="http://paologabrielesfredda.it" target="_blank">pgsfredda</a> &copy; 2019-2022, Italy.<small><p>';
        copy.className = divConfig.copyDIVClasses;

        this._loaderDIV.hide();
    }

    clearLinks() {
        this._bodyDIV.removeAdvLinks();
    }

    addBlock(content: string | pgAdvLibString, options?: pgAdvBodyAddOptions) {
        this._bodyDIV.add(typeof content === 'string'? content: content.text, options);
    }

    mergeBlockOptions(content: string | pgAdvLibString, options?: pgAdvBodyAddOptions): pgAdvBodyAddOptions {
        let opt: pgAdvBodyAddOptions;
        
        if(content && typeof content !== 'string') {
            opt = {
                tag: content.tag || (options? options.tag: undefined),
                classes: content.classes || (options? options.classes: undefined),
            }
        }
        else {
            opt = options
        }

        return opt;
    }

    writeText(text: pgAdvLibText, options?: { continue?: pgAdvLibLinkData, cr?: boolean, blockOpts?: pgAdvBodyAddOptions}) {
        let bo = (options?options.blockOpts: undefined);

        if(!Array.isArray(text)) text = [text];
        
        text.forEach(t => {
            this.addBlock(t, this.mergeBlockOptions(t, bo));
            if((options)&&(options.cr)) this.writeEmptyLine(bo);
        });
        //else this.addBlock(text, this.mergeBlockOptions(text, bo));    
        
        if((options)&&(options.continue)) {
            this.addBlock(getAdvLink(options.continue.prompt, undefined, [{attr: pgAdvLibLinkCmdAttr, cmd: options.continue.cmd}, {attr: pgAdvLibLinkEchoAttr, cmd: 'false'}, {attr: pgAdvLibLinkDelAttr, cmd: 'true'}]), bo);
            //this.writeEmptyLine(bo);
        };
    }

    writeEmptyLine(blockOpts?: pgAdvBodyAddOptions) {
        this.addBlock('&nbsp;<br>', blockOpts);
    }

    clearText() {
        this._bodyDIV.clear();
    }

    set title(s: string) {
        this._headerDIV.title = s;
    }

    get title(): string {
        return this._headerDIV.title;
    }

    set scorer(s: string) {
        this._headerDIV.scorer = s;
    }

    get scorer(): string {
        return this._headerDIV.scorer;
    }

    set infos(s: string) {
        this._headerDIV.infos = s;
    }

    get infos(): string {
        return this._headerDIV.infos;
    }

    set footer(s: string) {
        this._footerDIV.content = s;
    }

    get footer(): string {
        return this._footerDIV.content;
    }

    hideCmdline(h: boolean = true) {
        this._bodyDIV.hideCmdline(h);
    }

    get isHiddenCmdline(): boolean {
        return this._bodyDIV.isHiddenCmdline;
    }

    loop(): Promise<pgAdvLibPushCmd> {
        return this._bodyDIV.loop();
    }

    showError(err: any) {
        this.footer = '<div class="' + this._errorClasses + '">' + this._errorMessage + JSON.stringify(err) + '</div>';
    }

    set clickFunc(f: (value: pgAdvLibPushCmd)=> any) {
        this._bodyDIV.resolveFunc = f;
    };
}