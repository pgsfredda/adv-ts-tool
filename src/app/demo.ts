import { pgAdvLibObject } from "./pg-adv-story/pg-adv-lib/pg-adv-lib-object";
import { pgAdvStory } from "./pg-adv-story/pg-adv-lib/pg-adv-engine/pg-adv-story";
import { pgAdvLibVerb } from "./pg-adv-story/pg-adv-lib/pg-adv-lib-verb";
import { pgAdvLibAction } from "./pg-adv-story/pg-adv-lib/pg-adv-lib-action";
import { pgAdvLibExitcode } from "./pg-adv-story/pg-adv-lib/pg-adv-lib-defs";
import { pgAdvEngineNoError } from "./pg-adv-story/pg-adv-lib/pg-adv-engine/pg-adv-engine";
import { IT_Message } from "./it-IT";

export class demoStory extends pgAdvStory {
    init() {

        /*
         * Init general story fields
         */
        this.title  = '<h1 class="pgadv-small-caps"><center>The <span class="text-muted">demo</span> Story Title</center></h1>';
        this.author = 'Paolo Gabriele Sfredda';
        this.serial = 'it-pgsfredda-pg-adv-demo-001';
        this.version= '1.0.0';

        this.introduction  = [];
        this.introduction.push(this.title);
        this.introduction.push('Here begins your story, a great adventure in the <mark>Interactive Fiction</mark> world.');
        this.introduction.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque <adv-l cmd="x accumsan">accumsan</adv-l> arcu sed felis porttitor mollis. Integer consectetur dignissim odio ut consectetur. Vestibulum sit amet nibh in quam malesuada <adv-l>elementum</adv-l>. Donec commodo semper dui ac consectetur. Cras in tellus at est hendrerit semper. Pellentesque vitae auctor urna. Sed pulvinar finibus erat eget ornare. Quisque placerat fringilla neque, at bibendum nulla vehicula in. Sed vestibulum velit at lacus vulputate, vel ultricies orci efficitur.');
        this.introduction.push('<center><img class="img-fluid col-md-4" src="assets/images/advTS.png" alt="Italian Trulli"></center><br>Morbi quis dolor ac nunc sodales blandit. Donec nunc eros, eleifend malesuada cursus eget, dignissim vitae lectus. Donec sagittis id sem ut congue.');

        this.footer = '<blockquote class="blockquote"><p class="m-0">Lorem ipsum dolor sit amet.</p><footer class="blockquote-footer">A demo IF story by <cite title="' + this.author + '">' + this.author + '</cite></footer></blockquote>';

        /*
         * Init story dictionary and messages
         */
        this.messages = IT_Message;

        let paolo = new pgAdvLibObject({
            external   : 'Il giocatore',
            description: 'Un vero eroe che non ha paura di addentrarsi nei meandri di un nuovo sistema di gestione delle IF.',
            name       : ['paolo', 'gabriele'],
            attributes : { male: true, light: true }
        });

        let fabia = new pgAdvLibObject({
            external   : 'La giocatrice',
            description: 'Una vera eroina che non ha paura di riordinare pur di accedere a un nuovo sistema di gestione delle IF.',
            name       : ['fabia']
        });

        this.objects = {
            player: paolo,
            radura: new pgAdvLibObject({
                external   : 'Nella radura',
                description: "Un luogo suggestivo circondato da alte betulle.<br>L'erba spontanea è verde e non troppo alta.<br>Nell'aria profumo di bosco.",
                name       : ['radura', 'prato'],
            }),
            castle: new pgAdvLibObject({
                external   : 'Entro le mura del castello',
                description: 'I torrioni e le mura del castello sono davvero imponenti. Senti ancora le urla dei tanti soldati morti nel tentativo di conquistare questa rocca.',
                name       : ['castello']
            }),
        };

        this.actions = {
            quitAct: new pgAdvLibAction({
                func: (info) => {
                    this.engine.eng_stop(pgAdvEngineNoError); 
                    return pgAdvLibExitcode.stop;
                }
            }),
            startAct: new pgAdvLibAction({
                func: (info) => {
                    this.engine.gui_title = this.engine.obj_parent(this.engine.sto_player).external;
                    this.engine.gui_print_ret('<br><br><b>' + this.engine.obj_parent(this.engine.sto_player).external + '</b>');
                    this.engine.gui_print_ret(this.engine.obj_description(this.engine.sto_location));
                    this.engine.gui_showCmdLine();
                    
                    return pgAdvLibExitcode.stop;
                }
            }),
            eatAct: new pgAdvLibAction({
                func: (info) => {
                    if(!info.noun) return this.engine.gui_print_ret('Sembra tu non abbia mangiato nulla di interessante');
                    return this.engine.gui_print_ret('Hai mangiato ' + info.noun + ': ottimo!');
                }
            }),
        };

        this.verbs = [
            new pgAdvLibVerb({ name: ['q', 'quit', 'fine'], patterns: [{ action: 'quitAct'}]}),
            new pgAdvLibVerb({ name: ['start'], patterns: [{ action: 'startAct'}]}),
            new pgAdvLibVerb({ name: ['mangio', 'ingurgito'], patterns: [{ action: 'eatAct'}]}),
        ]

        /* 
         * Init starting story fields
         */     
        this.engine.sto_player = 'player';
        this.engine.sto_location = 'radura';

        this.engine.gui_footer = this.footer;
        this.engine.gui_print_intro(this.introduction, {prompt: 'Continua', cmd: 'start'});
    }
}