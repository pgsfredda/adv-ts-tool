import { pgAdvLibText, pgAdvMessages } from "../pg-adv-lib-defs";
import { pgAdvEngine } from "./pg-adv-engine";
import { pgAdvLibVerb } from "../pg-adv-lib-verb";

export abstract class pgAdvStory {
    serial      : string;
    objects     : {};
    actions     : {};
    verbs       : Array<pgAdvLibVerb> = [];
    author      : string;
    authorSite  : string;
    copywrite   : string;
    introduction: pgAdvLibText;
    footer      : pgAdvLibText;
    title       : string;
    version     : string;
    messages    : pgAdvMessages;

    constructor(
        protected engine : pgAdvEngine,
    ) {};

    abstract init();
}