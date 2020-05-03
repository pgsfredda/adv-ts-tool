export class pgAdvLibToken {
    protected _token: string;

    constructor(t: string) {
        this.token = t;
    }

    get token(): string {
        return this._token;
    }
    
    set token(t: string) {
        let p = t.search(/[^a-z,A-Z,0-9]/g);
        if (p>=0) throw "'" + t + "' must be a single token string (ie: 'name' -> ok 'name1 and-name2 ->ko) First character not admitted: '"+ t.substr(p,1) + "'";
        this._token = t.toLowerCase();
    }
}