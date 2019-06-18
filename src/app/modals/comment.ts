export class PostComment {

    private _username: string;
    private _userPicture: string;
    private _date: number;
    private _content: string;
    private _formattedDate: string;
    private _id: string;
    private _likes: {};
    private _dislikes: {};

    // tslint:disable-next-line:max-line-length
    constructor(username: string, userPicture: string, date: number, content: string, formattedDate: string, id: string,  likes: {}, dislikes: {}) {
        this._content = content;
        this._date = date;
        this._userPicture = userPicture;
        this._username = username;
        this._formattedDate = formattedDate;
        this._id = id;
        this._likes = likes;
        this._dislikes = dislikes;
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

    get formattedDate() {
        return this._formattedDate;
    }

    get content() {
        return this._content;
    }

    get id() {
        return this._id;
    }

    set id(idString: string) {
        this._id = idString;
    }

    get likes() {
        return this._likes;
    }

    get dislikes() {
        return this._dislikes;
    }

    set likes(likes) {
        this._likes = likes;
    }

    set dislikes(dislikes) {
        this._dislikes = dislikes;
    }

    get likesCount() {
        if (this._likes) {
            return Object.entries(this._likes).length;
        } else {
            return 0;
        }
    }

    get disLikesCount() {
        if (this.dislikes) {
            return Object.entries(this.dislikes).length;
        } else {
            return 0;
        }
    }

    get jsonData() {
        return {
            userPicture: this._userPicture,
            username: this._username,
            date: this._date,
            content: this._content,
            formattedDate: this._formattedDate,
            id: this._id
        };
    }

}
