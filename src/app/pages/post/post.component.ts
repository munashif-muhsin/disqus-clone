import {
  Component,
  OnInit,
  NgZone
} from '@angular/core';
import {
  ActivatedRoute,
  ParamMap
} from '@angular/router';
import { PostService } from 'src/app/providers/post.service';
import { Post } from 'src/app/modals/post';
import { AccountService } from 'src/app/providers/account.service';
import { PostComment } from 'src/app/modals/comment';
import * as moment from 'moment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  postId: string;
  post: Post;
  currentUser;
  isLoggedIn: boolean;
  comment: string;
  showReplyBoxId: string;
  reply: string;

  constructor(private route: ActivatedRoute, private postService: PostService, private Account: AccountService, private _zone: NgZone) {
    this.Account._auth.onAuthStateChanged((user) => {
      this._zone.run(() => {
        if (user) {
          this.setUser();
          this.isLoggedIn = true;
        } else {
          this.currentUser = undefined;
          this.isLoggedIn = false;
        }
      });
    });
  }

  async addComment(): Promise<void> {
    if (!this.currentUser) {
      return;
    }
    if (!this.comment || this.comment.trim() === '') {
      return;
    }
    // tslint:disable-next-line:max-line-length
    const newComment: PostComment = new PostComment(this.currentUser.name, '', Date.now(), this.comment, moment().calendar(), 'not_available',  {}, {});
    const result = await this.postService.addComment(newComment, this.postId);
    if (result) {
      newComment.id = result;
      this.comment = '';
      this.post.comments.unshift(newComment);
    }
  }

  toggleReply(commentId: string): void {
    this.showReplyBoxId = commentId;
  }

  async addReply(commentId: string): Promise<void> {
    if (!this.currentUser) {
      return;
    }
    if (!this.reply || this.reply.trim() === '') {
      return;
    }
    // tslint:disable-next-line:max-line-length
    const newreply: PostComment = new PostComment(this.currentUser.name, '', Date.now(), this.reply, moment().calendar(), 'not_available',  {}, {});
    const result = await this.postService.addReply(newreply, this.postId, commentId);
    if (result) {
      newreply.id = result;
      this.comment = '';
      const commentIndex = this.post.comments.findIndex((x) => x.id === commentId);
      this.post.comments[commentIndex].replies.unshift(newreply);
    }
  }



  toggleCommentLike(id: string, isDisliked?: boolean) {
    if (!this.currentUser) {
      return;
    }
    const commentIndex = this.post.comments.findIndex((x) => x.id === id);
    const comment = this.post.comments[commentIndex];
    if (!comment.likes) {
      comment.likes = {};
    }
    if (comment.likes[this.currentUser.uid]) {
      delete comment.likes[this.currentUser.uid];
      this.postService.toggleCommentLike(this.post.id, comment.id, false, this.currentUser.uid);
    } else {
      if (!isDisliked) {
        this.toggleCommentDislike(id, true);
        comment.likes[this.currentUser.uid] = true;
        this.postService.toggleCommentLike(this.post.id, comment.id, true, this.currentUser.uid);
      }
    }
    this.post.comments[commentIndex] = comment;
  }

  toggleCommentDislike(id: string, isliked?: boolean) {
    if (!this.currentUser) {
      return;
    }
    const commentIndex = this.post.comments.findIndex((x) => x.id === id);
    const comment = this.post.comments[commentIndex];
    if (!comment.dislikes) {
      comment.dislikes = {};
    }
    if (comment.dislikes[this.currentUser.uid]) {
      delete comment.dislikes[this.currentUser.uid];
      this.postService.toggleCommentDisLike(this.post.id, comment.id, false, this.currentUser.uid);
    } else {
      if (!isliked) {
        this.toggleCommentLike(id, true);
        comment.dislikes[this.currentUser.uid] = true;
        this.postService.toggleCommentDisLike(this.post.id, comment.id, true, this.currentUser.uid);
      }
    }
    this.post.comments[commentIndex] = comment;
  }

  toggleReplyLike(replyid: string, id: string, isDisliked?: boolean) {
    if (!this.currentUser) {
      return;
    }
    const commentIndex = this.post.comments.findIndex((x) => x.id === id);
    const comment = this.post.comments[commentIndex];
    const replyIndex = comment.replies.findIndex((x) => x.id === replyid);
    const reply = comment.replies[replyIndex];
    if (!reply.likes) {
      reply.likes = {};
    }
    if (reply.likes[this.currentUser.uid]) {
      delete reply.likes[this.currentUser.uid];
      this.postService.toggleReplyLike(this.post.id, comment.id, reply.id, false, this.currentUser.uid);
    } else {
      if (!isDisliked) {
        this.toggleReplyDislike(replyid, id, true);
        reply.likes[this.currentUser.uid] = true;
        this.postService.toggleReplyLike(this.post.id, comment.id, reply.id, true, this.currentUser.uid);
      }
    }
    this.post.comments[commentIndex].replies[replyIndex] = reply;
  }

  toggleReplyDislike(replyid: string, id: string, isliked?: boolean) {
    if (!this.currentUser) {
      return;
    }
    const commentIndex = this.post.comments.findIndex((x) => x.id === id);
    const comment = this.post.comments[commentIndex];
    const replyIndex = comment.replies.findIndex((x) => x.id === replyid);
    const reply = comment.replies[replyIndex];
    if (!reply.dislikes) {
      reply.dislikes = {};
    }
    if (reply.dislikes[this.currentUser.uid]) {
      delete reply.dislikes[this.currentUser.uid];
      this.postService.toggleReplyDisLike(this.post.id, comment.id, reply.id, false, this.currentUser.uid);
    } else {
      if (!isliked) {
        this.toggleReplyLike(replyid, id, true);
        reply.dislikes[this.currentUser.uid] = true;
        this.postService.toggleReplyDisLike(this.post.id, comment.id, reply.id, true, this.currentUser.uid);
      }
    }
    this.post.comments[commentIndex].replies[replyIndex] = reply;
  }

  async setUser(): Promise<void> {
    this.currentUser = (await this.Account.user).val();
  }

  togglelike(id: string, isDisliked?: boolean): Promise<void> {
    if (!this.currentUser) {
      return;
    }
    if (!this.post.likes) {
      this.post.likes = {};
    }
    if (this.post.likes[this.currentUser.uid]) {
      delete this.post.likes[this.currentUser.uid];
      this.postService.toggleLike(this.post.id, false, this.currentUser.uid);
    } else {
      if (!isDisliked) {
        this.toggleDislike(id, true);
        this.post.likes[this.currentUser.uid] = true;
        this.postService.toggleLike(this.post.id, true, this.currentUser.uid);
      }
    }
  }

  toggleDislike(id: string, isLiked?: boolean): Promise<void> {
    if (!this.currentUser) {
      return;
    }
    if (!this.post.dislikes) {
      this.post.dislikes = {};
    }
    if (this.post.dislikes[this.currentUser.uid]) {
      delete this.post.dislikes[this.currentUser.uid];
      this.postService.toggleDislike(this.post.id, false, this.currentUser.uid);
    } else {
      if (!isLiked) {
        this.togglelike(id, true);
        this.post.dislikes[this.currentUser.uid] = true;
        this.postService.toggleDislike(this.post.id, true, this.currentUser.uid);
      }
    }
  }


  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const param = < any > params;
      this.postId = param.params.id;
      console.log(this.postId);
      this.getPost();
    });
  }

  async getPost(): Promise<void> {
    this.post = await this.postService.getPost(this.postId);
    console.log(this.post);
  }

}
