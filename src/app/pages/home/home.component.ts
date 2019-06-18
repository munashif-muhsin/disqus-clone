import {
  Component,
  OnInit,
  NgZone
} from '@angular/core';
import {
  AccountService
} from 'src/app/providers/account.service';
import {
  Post
} from 'src/app/modals/post';
import {
  PostService
} from 'src/app/providers/post.service';
import {
  User
} from 'src/app/modals/user';
import { PostComment } from 'src/app/modals/comment';
import * as moment from 'moment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoggedIn: boolean;
  posts: Array < Post > = [];
  isCreatePostModalShown = false;
  newpost: any = {};
  errorMessage: string;
  currentUser: any;

  constructor(private Account: AccountService, private _zone: NgZone, private Posts: PostService) {
    this.Account._auth.onAuthStateChanged((user) => {
      this._zone.run(() => {
        if (user) {
          this.currentUser = user;
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      });
    });
    this.getPosts();
  }

  async getPosts(): Promise < void > {
    this.posts = await this.Posts.getPosts();
    console.log(this.posts);
  }

  ngOnInit() {}

  hideModal() {
    this.isCreatePostModalShown = false;
  }

  togglelike(id: string, isDisliked?: boolean) {
    const postIndex = this.posts.findIndex((x) => x.id === id);
    if (postIndex < 0) {
      return;
    }
    const post = this.posts[postIndex];
    if (!post.likes) {
      post.likes = {};
    }
    if (post.likes[this.currentUser.uid]) {
      delete post.likes[this.currentUser.uid];
      this.Posts.toggleLike(post.id, false, this.currentUser.uid);
    } else {
      if (!isDisliked) {
        this.toggleDislike(id, true);
        post.likes[this.currentUser.uid] = true;
        this.Posts.toggleLike(post.id, true, this.currentUser.uid);
      }
    }
     this.posts[postIndex] = post;
  }

  toggleDislike(id: string, isLiked?: boolean) {
    const postIndex = this.posts.findIndex((x) => x.id === id);
    if (postIndex < 0) {
      return;
    }
    const post = this.posts[postIndex];
    if (!post.dislikes) {
      post.dislikes = {};
    }
    if (post.dislikes[this.currentUser.uid]) {
      delete post.dislikes[this.currentUser.uid];
      this.Posts.toggleDislike(post.id, false, this.currentUser.uid);
    } else {
      if (!isLiked) {
        this.togglelike(id, true);
        post.dislikes[this.currentUser.uid] = true;
        this.Posts.toggleDislike(post.id, true, this.currentUser.uid);
      }
    }
     this.posts[postIndex] = post;
  }

  async post() {
    const firebaseUser = (await this.Account.user).val();
    const user: User = new User(firebaseUser.name, firebaseUser.email, firebaseUser.uid);
    const formattedDate = moment().calendar();
    const newPost: Post = new Post(user, this.newpost.content, Date.now(), {}, {}, Array(), 'not_available', formattedDate);
    const result = await this.Posts.addPost(newPost);
    if (result !== 'false') {
      newPost.id = result;
      this.posts.unshift(newPost);
      this.isCreatePostModalShown = false;
    }
    console.log(this.posts);
  }

  validate() {
    if (this.newpost.content == null || this.newpost.content.trim() === '') {
      this.errorMessage = 'Add some words';
    }

    if (this.errorMessage == null) {
      this.post();
    } else {
      setTimeout(() => {
        this.errorMessage = null;
      }, 5000);
    }
  }

}
