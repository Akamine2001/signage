import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';
import { User } from './user';
import { promises } from 'dns';

export interface ClassroomData{
  roomName: string;
  period1: string;
  period2: string;
  lunch: string;
  period3: string;
  period4: string;
  period5: string;
  period6: string;
  afterSchool: String;
}

export interface UserDatas {
  name: string;
  mail: string;
  photoURL?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService{
  afsCollection: AngularFirestoreCollection<ClassroomData>;
  items: Observable<ClassroomData[]>
  weekData: String[] =  [ "monday", "monday", "tuesday", "wednesday", "thursday", "friday", "friday" ] ;
  weekDataJp: string[] = [ "月曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "金曜日",];
  roomName: string[] = [ "102", "104", "106", "204", "MM"];
  weatherURL: string = 'https://weather.tsukumijima.net/api/forecast/city/471020';
  weatherData: string | undefined;
  mails: string[] = [];
  names: string[] = [];
  userDatas: User[];

  constructor(private afs: AngularFirestore, private http:HttpClient) {
    this.afsCollection = afs.collection<ClassroomData>(<string>(this.weekData[new Date().getDay()]))
    this.items = this.afsCollection.valueChanges();
    this.userDatas = [];
    this.getAllUsersDatas();
    // this.http.get(this.weatherURL).subscribe(data => {
    //   console.log(JSON.stringify(data));
    //   this.weatherData = JSON.stringify(data);
    // });
  }

  getAllUsersDatas(){
    //this.userDatas = [];
    const userRef = this.afs.collection<User>('users').get().subscribe(snapshot => {
      snapshot.forEach(doc => {
        if(this.userDatas){
        this.userDatas?.push(doc.data());
        }
        //console.log('userData[] :'+ Array.from(this.userDatas));
      });
    }, error => {
      console.log('Error fetching users:', error);
    }
    );
    console.log('userData[] :'+ Array.from(this.userDatas));
  }

  getFsData(){
    return this.items;
  }

  getOtherDayData(week: string){
    this.afsCollection = this.afs.collection<ClassroomData>(<string>week)
    this.items = this.afsCollection.valueChanges();
    return this.items;
  }

  editData(col: string, doc: string, clmn: string, cls: string){
    let docRef = this.afs.collection(col).doc(doc);
    docRef.update({
      [clmn]: cls
    });
  }

  displayedColumns: string[] = [
    "roomName",
    "period1",
    "period2",
    "lunch",
    "period3",
    "period4",
    "period5",
    "period6",
    "afterSchool",
  ]
}
