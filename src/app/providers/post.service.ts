import {
  Injectable
} from '@angular/core';
import {
  AngularFireDatabase
} from '@angular/fire/database';
import {
  Post
} from '../modals/post';
import {
  PostComment
} from '../modals/comment';
import {
  User
} from '../modals/user';
import {
  forEach
} from '@angular/router/src/utils/collection';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private _fireDB: AngularFireDatabase) {}


  async getPost(id: string): Promise < Post > {
    try {
      const snapshot = await this._fireDB.database.ref('/').child('posts').child(id).once('value');
      const snapshotValue = snapshot.val();
      if (snapshotValue) {
        const post: Post = this._createpost(snapshotValue);
        post.id = id;
        return post;
      }
    } catch (error) {
      return null;
    }
  }

  async toggleLike(id: string, value: boolean, uid: string): Promise < boolean > {
    let result: boolean;
    if (value) {
      result = await this._fireDB.database.ref('/').child('posts').child(id).child('likes').child(uid).set(true);
    } else {
      result = await this._fireDB.database.ref('/').child('posts').child(id).child('likes').child(uid).remove();
    }
    return result;
  }

  async toggleCommentLike(postid: string, commentid: string, value: boolean, uid: string): Promise < boolean > {
    let result: boolean;
    if (value) {
      // tslint:disable-next-line:max-line-length
      result = await this._fireDB.database.ref('/').child('posts').child(postid).child('comments').child(commentid).child('likes').child(uid).set(true);
    } else {
      // tslint:disable-next-line:max-line-length
      result = await this._fireDB.database.ref('/').child('posts').child(postid).child('comments').child(commentid).child('likes').child(uid).remove();
    }
    return result;
  }
  async toggleCommentDisLike(postid: string, commentid: string, value: boolean, uid: string): Promise < boolean > {
    let result: boolean;
    if (value) {
      // tslint:disable-next-line:max-line-length
      result = await this._fireDB.database.ref('/').child('posts').child(postid).child('comments').child(commentid).child('dislikes').child(uid).set(true);
    } else {
      // tslint:disable-next-line:max-line-length
      result = await this._fireDB.database.ref('/').child('posts').child(postid).child('comments').child(commentid).child('dislikes').child(uid).remove();
    }
    return result;
  }

  async toggleDislike(id: string, value: boolean, uid: string): Promise < boolean > {
    let result: boolean;
    if (value) {
      result = await this._fireDB.database.ref('/').child('posts').child(id).child('dislikes').child(uid).set(true);
    } else {
      result = await this._fireDB.database.ref('/').child('posts').child(id).child('dislikes').child(uid).remove();
    }
    return result;
  }

  private _createpost(post: any): Post {
    let comments;
    console.log(post);
    if (post.comments) {
      const entries = Object.entries(post.comments);
      const commentslist = entries.map((entry) => {
        const newEntry: any = entry[1];
        newEntry['key'] = entry[0];
        return newEntry;
      });
      comments = commentslist.map((comment) => {
        const formattedDate = moment(comment.date).calendar();
        // tslint:disable-next-line:max-line-length
        return new PostComment(comment.username, comment.userPicture, comment.date, comment.content, formattedDate, comment.key, comment.likes, comment.dislikes);
      });
    } else {
      comments = [];
    }
    const date = moment(post.date).calendar();
    const author = new User(post.author.name, post.author.email, post.author.uid);
    const newPost: Post = new Post(author, post.content, post.date, post.likes, post.dislikes, comments, post.key, date);
    return newPost;
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
        return this._createpost(post);
      });
      return ListOfPosts;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async addPost(post: Post): Promise < string > {
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

  async addComment(comment: PostComment, postId: string): Promise<string> {
    try {
      const commentData = comment.jsonData;
      delete commentData.id;
      delete commentData.formattedDate;
      const result = await this._fireDB.database.ref('/').child('posts').child(postId).child('comments').push(commentData);
      return result.key;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
