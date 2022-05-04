
export class pgAdvLibBase {

    constructor(
        protected _context: string,
        protected _internalErr = 'internal error. See the console messages'
    ) {}

    getError(mess: string = '') {
        return `*** pgAdvTS *** ${this._context}${mess?' - ' + mess: ''}`;
    }

    getInternalError(mess: string = '') {
        return `${this._internalErr}${mess?' - ' + mess: ''}`;
    }

}