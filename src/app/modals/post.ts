import {PostComment} from './comment';
import { User } from './user';

export class Post {

    private _author: User;
    private _content: string;
    private _date: number;
    private _likes: {};
    private _dislikes: {};
    private _comments: Array<PostComment>;
    private _id: string;
    private _formattedDate: string;

    // tslint:disable-next-line:max-line-length
    constructor(author: User, content: string, date: number, likes: {}, dislikes: {}, comments: Array<PostComment> = [], id: string, formattedDate: string) {
        this._author = author;
        this._content = content;
        this._date = date;
        this._likes = likes;
        this._dislikes = dislikes;
        this._comments = comments;
        this._id = id;
        this._formattedDate = formattedDate;
    }

    get author() {
        return this._author;
    }

    get content() {
        return this._content;
    }

    get date() {
        return this._date;
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

    get comments() {
        return this._comments;
    }

    get id() {
        return this._id;
    }

    set id(id: string) {
        this._id = id;
    }

    get formattedDate() {
        return this._formattedDate;
    }

    get jsonData() {
        return {
            author: this._author,
            content: this._content,
            date: this._date,
            likes: this._likes,
            dislikes: this._dislikes,
            comments: this._comments
        };
    }
}
