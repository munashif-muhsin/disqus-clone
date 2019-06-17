export class User {

    private _name: string;
    private _email: string;
    private _uid: string;

    constructor(name: string, email: string, uid: string) {
        this._name = name;
        this._email = email;
        this._uid = uid;
    }

    get name() {
        return this._name;
    }

    get email() {
        return this._email;
    }

    get uid() {
        return this._uid;
    }

    get jsonData() {
        return {
            'name': this._name,
            'email': this._email,
            'uid': this._uid
        };
    }
}
