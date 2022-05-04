import { pgAdvLibAction } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib"
import { demoStory } from "./demo";
import { pgAdvLibDefaultActions } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-default-actions";

export class demoActions extends pgAdvLibDefaultActions {
    story: demoStory;

    eatAct = new pgAdvLibAction({
        func: (info) => {
            if(!info.noun) return this.story.engine.gui.print_ret(this.story.messages.eatNoFood);
            return this.story.engine.gui.print_ret(this.story.messages.eatFood(info));
        }
    });
};