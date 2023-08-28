import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from './user';
import { Observable, Subject, map, of, switchMap, takeUntil } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
//import { browserSessionPersistence, setPersistence } from 'firebase/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService{
  userName: string | undefined;
  userPhoto: SafeResourceUrl | undefined;
  docNames: string[] | undefined;

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFireStore: AngularFirestore,
    private router: Router,
    private domSanitizer: DomSanitizer,
  ){
    //firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    this.angularFireAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
  }


  async googleSignin() {
    this.signOut();
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.signInWithPopup(provider) as any;
    console.log('login user :' + JSON.stringify(credential.user.displayName));
    console.log('photo URL :'+ JSON.stringify(credential.user.photoURL));
    this.userPhoto = this.domSanitizer.bypassSecurityTrustResourceUrl(credential.user.photoURL);
    this.userName = JSON.stringify(credential.user.displayName);
    const subscribe = this.getDocumentNames('users').subscribe(names => {
      this.docNames = names;
      const uidIncluded = this.docNames.includes(credential.user.uid);
      const emailIncluded = this.docNames.includes(credential.user.email);
      console.log('subscribe!');
      if (uidIncluded) {
        console.log('signin!');
      } else if (emailIncluded) {
        this.updateUserData(credential.user);
        console.log('update!');
      } else {
        this.signOut();
        console.log('Signin denied!');
      }
      subscribe.unsubscribe();
    });
  }

  //  // Observableとの接続を解除する
  //  documentNames.subscribe(
  //   (documentNames) => {
  //     // データを処理する
  //   },
  //   (error) => {
  //     // エラーを処理する
  //   },
  //   () => {
  //     // Observableとの接続を解除する
  //   }
  // );

  async signOut() {
    await this.angularFireAuth.signOut().then(() => {
      this.userName = undefined;
      this.userPhoto = undefined;
      this.router.navigate(['/']);
    })
  }

  get isLoggedIn(): boolean {
    if(this.userName == undefined){
      return false;
    }
    return true;
  }

  setNewUserDoc(username: string, email: string) {
    const userCollection = this.angularFireStore.collection<User>('users').doc(email);
    const data = {
      uid: '',
      email: email,
      displayName: (username || ''),
      photoURL: ''
    }
    userCollection.set(data, { merge: true });
  }

  getDocumentNames(collectionName: string): Observable<string[]> {
    return this.angularFireStore.collection(collectionName).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          return action.payload.doc.id;
        });
      })
    );
  }

    // old regist data delete, and new UserData regist
  private async updateUserData(user: User) {
    const email: string = JSON.stringify(user.email);
    const delUserRef: AngularFirestoreDocument<User> = this.angularFireStore.collection('users').doc(user.uid);
    const userRef: AngularFirestoreDocument<User> = this.angularFireStore.collection('users').doc(user.uid);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    try {
      await this.angularFireStore.firestore.runTransaction(async (transaction) => {
        // delete
        const delUserRef = this.angularFireStore.collection('users').doc('banyantreeokinawa@gmail.com').ref;
        await transaction.delete(delUserRef);
        // write
        transaction.set(userRef.ref, data, { merge: true });
      });

      console.log('Document deleted and data updated successfully.');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }
}

