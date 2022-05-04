import { pgAdvStory } from '../../app/pg-adv-story/pg-adv-lib/pg-adv-lib'

import { demoActions } from './demo-actions';
import { demoObjects } from './demo-objects';
import { demoVerbs } from './demo-verbs';
import { demoRooms } from './demo-rooms';
import { demoCharacters } from './demo-characters';
import { getPropName } from '../../app/pg-adv-story/pg-adv-lib/pg-adv-utils';
import { demoMessages } from './demo-messages';

export class demoStory extends pgAdvStory {
    rooms     : demoRooms;
    objects   : demoObjects;
    actions   : demoActions;
    characters: demoCharacters;
    messages  : demoMessages;
    
    init() {
        /*
         * Init general story fields
         */
        this.title  = '<center>The <span class="text-muted">demo</span> Story Title</center>';
        this.author = 'Paolo Gabriele Sfredda';
        this.serial = 'it-pgsfredda-pg-adv-demo-001';
        this.version= '1.0.0';

        this.introduction  = [];
        this.introduction.push({text: this.title, tag: 'h1', classes: 'pgadv-title pgadv-small-caps'});
        this.introduction.push({text: 'Here begins your story, a great adventure in the <mark>Interactive Fiction</mark> world.', tag: 'p'});
        this.introduction.push({text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque <adv-l cmd="x accumsan">accumsan</adv-l> arcu sed felis porttitor mollis. Integer consectetur dignissim odio ut consectetur. Vestibulum sit amet nibh in quam malesuada <adv-l>elementum</adv-l>. Donec commodo semper dui ac consectetur.</p><p> Cras in tellus at est hendrerit semper. Pellentesque vitae auctor urna. Sed pulvinar finibus erat eget ornare. Quisque placerat fringilla neque, at bibendum nulla vehicula in. Sed vestibulum velit at lacus vulputate, vel ultricies orci efficitur.', tag: 'p'});
        this.introduction.push({text: '<center><img class="img-fluid col-md-4" src="assets/images/advTS.png" alt="IFTF Logo" title="IFTF Logo"></center><br>Morbi quis dolor ac nunc sodales blandit. Donec nunc eros, eleifend malesuada cursus eget, dignissim vitae lectus. Donec sagittis id sem ut congue.', tag: 'p'});

        this.footer = '<blockquote class="blockquote"><footer class="blockquote-footer">A demo IF story by <cite title="' + this.author + '">' + this.author + '</cite></footer></blockquote>';

        /*
         * Init story dictionary and messages
         */
        this.messages   = new demoMessages();
        this.rooms      = new demoRooms(this);
        this.objects    = new demoObjects(this);
        this.actions    = new demoActions(this);
        this.characters = new demoCharacters(this);
        
        this.verbs.concat(demoVerbs.list);

        /*
         * Init story objects properties
         */
        this.objects.patate.parent = this.rooms.radura;

        /* 
         * Init starting story fields
         */     
        this.playerID = getPropName(this.characters, this.characters.player); // to make sure you write the correct string 'player'
        this.locationID = getPropName(this.rooms, this.rooms.radura); // to make sure you write the correct string 'radura'. It is possibile to use directly the string ID

        this.engine.gui.setFooter(this.footer);
        this.engine.gui.print_intro(this.introduction, {prompt: 'Continua', cmd: 'start'});
       
    }
}
