import { pgAdvEngine } from './pg-adv-story/pg-adv-lib/pg-adv-engine/pg-adv-engine';
import { pgAdvStory } from './pg-adv-story/pg-adv-lib/pg-adv-engine/pg-adv-story';
import { pgAdvGUI } from './pg-adv-story/pg-adv-lib/pg-adv-gui/pg-adv-gui';

export class pgAdvApp {
    gui   : pgAdvGUI
    engine: pgAdvEngine;
    story : pgAdvStory;

    constructor(story: pgAdvStory){
        this.gui    = new pgAdvGUI(this);
        this.engine = new pgAdvEngine(this);
        this.story  = story;
        story.engine = this.engine;

        this._init();
        this.engine.start();
    };

    quit(err?: any) {
        this.gui.hideCmdline();
        if(err) this.error(err);

        return err;
    }

    error(err: any) {
        this.gui.showError(err);
    }

    protected _init() {
        this.gui.setup({
            copyDIVClasses        : 'text-right font-weight-lighter',
            storyDIVClasses       : 'fadeIn col-md-6 offset-md-3',
            loaderDIVClasses      : 'fadeIn',
            loaderDIVContent      : "Loading...",
            headerDIVClasses      : '',
            headerDIVTitleClasses : 'col-md-10 px-2 text-left font-weight-bold text-white bg-secondary ',
            headerDIVScorerClasses: 'col-md-2 px-2 text-right font-weight-bold text-white bg-secondary ',
            headerDIVInfosClasses : 'col-md-12 px-2 text-left font-weight-normal text-white bg-secondary ',
            headerDIVLine1Classes : 'd-flex',
            headerDIVLine2Classes : '',
            bodyDIVClasses        : 'pgadv-bg-advbody text-dark px-2',
            bodyDIVHeight         : '80vh',
            footerDIVClasses      : 'pgadv-bg-advbody',
            advLinkClasses        : 'pgadv-advlink',
            inputRowClasses       : 'd-flex my-3',
            inputRowPrompt        : '',
            inputLabelClasses     : 'col-auto pl-2 col-form-label',
            inputClasses          : 'form-control pgadv-form-control',
            inputDIVClasses       : 'flex-grow-1 p-0',
            inputPlaceholder      : this.story.messages.appInputPlaceholder,
            errorMessage          : this.story.messages.appQuitWithErrors,
            errorClasses          : 'p-3 mb-2 bg-danger text-white'
        });
    }
}
