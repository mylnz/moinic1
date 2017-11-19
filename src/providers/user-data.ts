///<reference path="../../node_modules/firebase/app/index.d.ts"/>
import {Injectable} from '@angular/core';

import {Events} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {AngularFireAuth} from "angularfire2/auth";
import {UserOptions} from "../interfaces/user-options";

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(public events: Events,
              public storage: Storage,
              private afAuth: AngularFireAuth) {
  }

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  async login(userOptions: UserOptions) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(userOptions.username, userOptions.password);
      if (result) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(userOptions.username);
        this.events.publish('user:login');
      }

    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  async signup(userOptions: UserOptions) {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(userOptions.username, userOptions.password);

      if (result) {
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.setUsername(userOptions.username);
        this.events.publish('user:signup');
      }
    } catch (e) {
      console.log(e);
    } finally {

    }
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
