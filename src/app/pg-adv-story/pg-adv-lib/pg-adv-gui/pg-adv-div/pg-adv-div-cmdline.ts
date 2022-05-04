import { pgAdvDIVArea } from "./pg-adv-div-area";
import { pgAdvLibPushCmdOpts, pgAdvLibPushCmd } from "../../pg-adv-lib-defs";

export const pgAdvDIVCmdlineMaxHistory = 30;

export class pgAdvDIVCmdline extends pgAdvDIVArea {

    input: pgAdvDIVArea;
    row  : pgAdvDIVArea; 
    
    cmd  : string;

    history: string[] = [];
    current: number = undefined;

    constructor(config: { ID: string, rowClasses?: string, prompt?: string, labelClasses?: string, inputDIVClasses?: string, inputClasses?: string, placeholder?: string }) {
        super(config);

        this.content = `
            <div id="cmdline-row">
                <label for="cmdline-input"></label>
                <div id="inputDIV">
                    <input id="cmdline-input" type="text">
                </div>
            </div>
        `;

        this.row = new pgAdvDIVArea({ID: 'cmdline-row'});
        this.row.element.className = config.rowClasses || '';

        let label = this.row.element.getElementsByTagName('label')[0];
        label.innerHTML = config.prompt || '';
        label.className = config.labelClasses || '';
        
        let inputDIV = this.row.element.getElementsByTagName('div').namedItem('inputDIV');
        inputDIV.className = config.inputDIVClasses || '';

        this.input = new pgAdvDIVArea({ID: 'cmdline-input'});
        this.input.element.className = config.inputClasses || '';
        this.input.element.setAttribute('placeholder', config.placeholder || '');
    }

    pushCmd(cmd: string, resolve: (value: pgAdvLibPushCmd)=> any, options?: pgAdvLibPushCmdOpts) {
        if(cmd && resolve) {
            this.cmd = cmd;
            if(this.history.length === pgAdvDIVCmdlineMaxHistory) this.history.splice(0, 1);
            this.history.push(this.cmd);
            this.current = this.history.length-1;
            this.disable();
            resolve({sentence: this.cmd, options: options || {} });
            this.resetInput();
            this.disable(false);
        }
    }

    resetInput(){
        this.input.element['value'] = '';
    }

    waitCmd(): Promise<pgAdvLibPushCmd> {
        this.input.element['focus']();
        return new Promise((resolve, eject)=> {
            this.input.element['onkeypress'] = (event) => { 
                if(event.keyCode == 13) {
                    this.pushCmd(event.srcElement['value'], resolve , { echo: true });
                };
            };
            this.input.element['onkeydown'] = (event: KeyboardEvent) => { 
                if(event.keyCode == 38) {
                    event.preventDefault();
                    event.stopImmediatePropagation()
                    if(this.history.length>0) {
                        event.srcElement['value'] = this.history[this.current];
                        event.srcElement['setSelectionRange'](0, event.srcElement['value'].length);
                        if(this.current>0) this.current--;
                    }
                }
                else if(event.keyCode == 40) {
                    event.preventDefault();
                    event.stopImmediatePropagation()
                    if(this.history.length>0) {
                        event.srcElement['value'] = this.history[this.current];
                        event.srcElement['setSelectionRange'](0, event.srcElement['value'].length);
                        if(this.current<(this.history.length-1)) this.current++;
                    }
                }
            };
        });
    }

    adjustScroll() {
        this.row.element.scrollIntoView({ behavior: "smooth", block: "end" });
    }
}