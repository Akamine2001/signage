import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from './user';
import { Observable, of, switchMap } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null | undefined>;
  userName: string | undefined;
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireStore: AngularFirestore,
    private router: Router
  ){
    this.user$ = this.angularFireAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.angularFireStore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);  // 空のObservableを返す
        }
      })
    );
  }

  async googleSignin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.signInWithPopup(provider) as any;
    console.log('login user :' + JSON.stringify(credential.user.displayName));
    this.userName = JSON.stringify(credential.user.displayName);
    this.router.navigate(['/regist']);
    return this.updateUserData(credential.user);
  }

  async signOut() {
    await this.angularFireAuth.signOut();
    this.router.navigate(['/signage']);
  }

  private updateUserData(user: User) {
    // ログイン時にfirestoreにuser dataを追加する
    const userRef: AngularFirestoreDocument<User> = this.angularFireStore.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    return userRef.set(data, { merge: true })
  }

}

