import { pgAdvStory, pgAdvLibAction, pgAdvEngineNoError, pgAdvLibExitcode } from '../../app/pg-adv-story/pg-adv-lib/pg-adv-lib'

import { IT_Message } from "./it-IT";
import { demoActions } from './demo-actions';
import { demoObjects } from './demo-objects';
import { demoVerbs } from './demo-verbs';
import { demoRooms } from './demo-rooms';
import { demoCharacters } from './demo-characters';

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
        this.messages   = IT_Message;

        this.rooms      = new demoRooms(this);
        this.objects    = new demoObjects(this);
        this.actions    = new demoActions(this);
        this.characters = new demoCharacters(this);
        this.verbs      = demoVerbs;

        /* 
         * Init starting story fields
         */     
        this.engine.sto_player = 'player';
        this.engine.sto_locationID = 'radura';

        this.engine.gui_footer = this.footer;
        this.engine.gui_print_intro(this.introduction, {prompt: 'Continua', cmd: 'start'});
    }
}