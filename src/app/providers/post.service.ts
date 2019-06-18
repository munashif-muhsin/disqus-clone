import {
  Injectable
} from '@angular/core';
import {
  AngularFireDatabase
} from '@angular/fire/database';
import {
  Post
} from '../modals/post';
import { PostComment } from '../modals/comment';
import { User } from '../modals/user';
import { forEach } from '@angular/router/src/utils/collection';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private _fireDB: AngularFireDatabase) {}

  async toggleLike(id: string, value: boolean, uid: string): Promise<boolean> {
   let result: boolean;
    if (value) {
      result = await this._fireDB.database.ref('/').child('posts').child(id).child('likes').child(uid).set(true);
    } else {
      result = await this._fireDB.database.ref('/').child('posts').child(id).child('likes').child(uid).remove();
    }
    return result;
  }

  async toggleDislike(id: string, value: boolean, uid: string): Promise<boolean> {
    let result: boolean;
    if (value) {
      result = await this._fireDB.database.ref('/').child('posts').child(id).child('dislikes').child(uid).set(true);
    } else {
      result = await this._fireDB.database.ref('/').child('posts').child(id).child('dislikes').child(uid).remove();
    }
    return result;
  }

  async getPosts(): Promise < Array < Post >> {
    try {
      const posts = await this._fireDB.database.ref('/').child('posts').once('value');
      if (!posts.val()) {
        return [];
      }
      const entries = Object.entries(posts.val());
      const postsList = entries.map((entry) => {
        const newEntry: any = entry[1];
        newEntry['key'] = entry[0];
        return newEntry;
      });
      const ListOfPosts = postsList.map((post) => {
        let comments;
        if (post.comments) {
          comments = post.comments.map((comment) => {
            return new PostComment(comment.username, comment.userPicture, comment.date, comment.content);
          });
        } else {
          comments = [];
        }
        const date = moment(post.date).calendar();
        const author = new User(post.author.name, post.author.email, post.author.uid);
        const newPost: Post = new Post(author, post.content, post.date, post.likes, post.dislikes, comments, post.key, date);
        return newPost;
      });
      return ListOfPosts;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async addPost(post: Post): Promise<string> {
    try {
      const newpost = {
        author: post.author.jsonData,
        content: post.content,
        likes: post.likes,
        dislikes: post.dislikes,
        comments: post.comments,
        date: post.date
      };
      const result = await this._fireDB.database.ref('/').child('posts').push(newpost);
      return result.key;
    } catch (error) {
      console.log(error);
      return 'false';
    }
  }
}

