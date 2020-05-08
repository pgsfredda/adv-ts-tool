import { pgAdvLibAction, pgAdvEngineNoError } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib"
import { pgAdvLibExitcode, pgAdvLibStoryDef } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-defs"

export class demoActions extends pgAdvLibStoryDef {

    quitAct = new pgAdvLibAction({
        func: (info) => {
            this.story.engine.eng_stop(pgAdvEngineNoError); 
            return pgAdvLibExitcode.stop;
        }
    });

    startAct = new pgAdvLibAction({
        func: (info) => {
            this.story.engine.gui_title = this.story.engine.sto_location.external;
            this.story.engine.gui_print_ret(`<br><br><b>${this.story.engine.sto_location.external}</b>`);
            this.story.engine.gui_print_ret(this.story.engine.obj_description(this.story.engine.sto_location, 'rooms'));
            this.story.engine.gui_showCmdLine();
            
            return pgAdvLibExitcode.stop;
        }
    });

    eatAct = new pgAdvLibAction({
        func: (info) => {
            if(!info.noun) return this.story.engine.gui_print_ret('Sembra tu non abbia mangiato nulla di interessante');
            return this.story.engine.gui_print_ret('Hai mangiato ' + info.noun + ': ottimo!');
        }
    });
};