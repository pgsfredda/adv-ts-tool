import { pgAdvLibStoryDef } from "./pg-adv-lib-story-def";
import { pgAdvLibAction } from "./pg-adv-lib-action";
import { pgAdvLibExitcode, pgAdvLibRoomDescriptionOptions, pgAdvLibRoomDescriptionOptionsDefault, pgAdvLibText, pgAdvLibComplexString } from "./pg-adv-lib-defs";
import { pgAdvEngineNoError } from "./pg-adv-engine/pg-adv-engine";
import { pgAdvLibRoom } from "./pg-adv-lib-room";

export class pgAdvLibDefaultActions extends pgAdvLibStoryDef {

    protected _compileDescrition(room: pgAdvLibRoom, options: pgAdvLibRoomDescriptionOptions = pgAdvLibRoomDescriptionOptionsDefault) {
        let objs: pgAdvLibText;
        let exits: pgAdvLibText;
        let description: pgAdvLibText = [];

        description.push(`<br><b>${room.external}</b>`);
        description = description.concat(this.story.description(room, 'rooms'));

        if(options && options.objs) objs = this.story.objs(room);
        if(options && options.exits) exits = this.story.exits(room); 
        if(objs || exits) description.push('');
        if(objs) description = description.concat(objs);
        if(exits) description = description.concat(exits);

        return description;
    }

    protected _showRoomDescription(room: pgAdvLibRoom, options: pgAdvLibRoomDescriptionOptions = pgAdvLibRoomDescriptionOptionsDefault) {
        this.story.engine.gui.setTitle(room.external);
        this.story.engine.gui.clearLinks();
        this.story.engine.gui.print_ret(this._compileDescrition(room, options));
    };

    genAct = new pgAdvLibAction({
        func: (info) => {
            this.story.engine.gui.print_ret(`${this.story.messages.storyGenericAction(info)}`);
            return pgAdvLibExitcode.stop;
        }
    })

    lookAct = new pgAdvLibAction({
        func: (info) => {
            this._showRoomDescription(this.story.location);
            return pgAdvLibExitcode.stop;
        }
    });

    quitAct = new pgAdvLibAction({
        func: (info) => {
            this.story.engine.stop(pgAdvEngineNoError); 
            return pgAdvLibExitcode.stop;
        }
    });

    goAct = new pgAdvLibAction({
        func: (info) => {
            let room = this.story.location;
            let exit = this.story.compass.getCompass(info.noun);
            let newloc  = room.exits? this.story.getExit(room.exits[exit]): undefined;

            if(newloc) {
                this.story.location = newloc;
                this._showRoomDescription(this.story.location);
            }
            else this.story.engine.gui.print_ret(this.story.messages.storyExitNoAllowed(this.story.compass.getCompassWorld(exit)));
            
            return pgAdvLibExitcode.stop;
        }
    });

    startAct = new pgAdvLibAction({
        func: (info) => {
            this._showRoomDescription(this.story.location);
            this.story.engine.gui.showCmdLine();
            
            return pgAdvLibExitcode.stop;
        }
    });
    
}