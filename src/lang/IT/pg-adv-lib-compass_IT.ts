import { pgAdvLibCompass } from "../../app/pg-adv-story/pg-adv-lib/pg-adv-lib-compass";


export class pgAdvDefaultCompass extends pgAdvLibCompass {
    values = {
        north    : ['nord', 'n^^'],
        south    : ['sud', 's^^'],
        east     : ['est', 'e^^'],
        west     : ['ovest', 'o^^'],
        northeast: ['nordest', 'ne^'],
        northwest: ['nordovest', 'no^'],
        southeast: ['sudest', 'se^'],
        southwest: ['sudovest', 'so^'],
        up       : ['su^', 'sopra', 'alto', 'a^^'],
        down     : ['giù', 'sotto', 'basso', 'b^^'],
        into     : ['dentro', 'in^'],
        outto    : ['fuori'],
    }
}