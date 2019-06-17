class User {

    private _name: String;
    private _email: String;

    constructor(name: String, email: String) {
        this._name = name;
        this._email = email;
    }

    get user() {
        return {
            name: this._name,
            email: this._email
        };
    }
}
