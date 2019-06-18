export class PostComment {

    private _username: string;
    private _userPicture: string;
    private _date: Date;
    private _content: string;

    constructor(username: string, userPicture: string, date: Date, content: string) {
        this._content = content;
        this._date = date;
        this._userPicture = userPicture;
        this._username = username;
    }

    get username() {
        return this._username;
    }

    get userPicture() {
        return this._userPicture;
    }

    get date() {
        return this._date;
    }

    get content() {
        return this._content;
    }

    get jsonData() {
        return {
            userPicture: this._userPicture,
            username: this._username,
            date: this._date,
            content: this._content
        };
    }

}
