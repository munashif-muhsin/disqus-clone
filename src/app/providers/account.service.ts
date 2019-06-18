import {
  Injectable
} from '@angular/core';
import {
  AngularFireAuth
} from '@angular/fire/auth';
import {
  AngularFireDatabase
} from '@angular/fire/database';

import {
  User
} from '../modals/user';
import * as firebase from 'firebase';
import { AngularFireModule } from '@angular/fire';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _fireAuth: AngularFireAuth, private _fireDB: AngularFireDatabase) {
    this._fireAuth.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const user = await this._fireAuth.auth.signInWithEmailAndPassword(email, password);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  get user() {
    return this._fireDB.database.ref('/').child('users').child(this._auth.currentUser.uid).once('value');
  }

  get _auth() {
    return this._fireAuth.auth;
  }

  async register(name: string, email: string, password: string): Promise < boolean > {
    try {
      const user = await this._fireAuth.auth.createUserWithEmailAndPassword(email, password);
      const uid: string = user.user.uid;
      const newuser: User = new User(name, email, uid);
      await this._fireDB.database.ref('/').child('users').child(uid).set(newuser.jsonData);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  logout() {
    this._fireAuth.auth.signOut();
  }


}
