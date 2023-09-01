import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User, preUser } from './user';
import { Observable, combineLatest, map } from 'rxjs';
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
    this.userPhoto = this.domSanitizer.bypassSecurityTrustResourceUrl(credential.user.photoURL);
    this.userName = JSON.stringify(credential.user.displayName);
    let docNames: string[][];
    this.getDocumentNames().subscribe(names => {
      docNames = names;
      console.log(docNames);
      if(docNames[0].includes(credential.user.uid)){}
      else if(docNames[1].includes(credential.user.email)){
        this.updateUserData(credential.user);
      }else {
        this.signOut();
      }
    })
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

  setNewPreUserDoc(username: string, email: string) {
    const userCollection = this.angularFireStore.collection<preUser>('preRegist').doc(email);
    userCollection.set({
      email: email,
      name: username,
    });
  }

  getDocumentNames(): Observable<string[][]> {
    const colRef1 = this.angularFireStore.collection('users').get();
    const colRef2 = this.angularFireStore.collection('preRegist').get();
    return combineLatest(colRef1,colRef2).pipe(
      map(([snap1, snap2]) => {
        const docNames1 = snap1.docs.map(doc => doc.id);
        const docNames2 = snap2.docs.map(doc => doc.id);
        return [docNames1, docNames2];
      })
    );
  }

  deleteUserDataDoc(docname:string, colname:string) {
    const ref = this.angularFireStore.collection(colname).doc(docname);
    ref.delete();
  }

    // pre regist data delete, and new UserData add
  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.angularFireStore.collection('users').doc(user.uid);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    userRef.set(data, { merge: true });
    this.deleteUserDataDoc(user.email, 'preRegist');
  }
}

