import { Injectable } from '@angular/core';
import { AngularFirestore,AngularFirestoreCollection,AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class DataService {
  afsCollection: AngularFirestoreCollection<ClassroomData>;
  items: Observable<ClassroomData[]>
  weekData: String[] =  [ "monday", "monday", "tuesday", "wednesday", "thursday", "friday", "friday" ] ;
  roomName: string[] = [ "102", "104", "106", "204", "MM"];
  constructor(private afs: AngularFirestore) {
    this.afsCollection = afs.collection<ClassroomData>(<string>(this.weekData[new Date().getDay()]))
    this.items = this.afsCollection.valueChanges();
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
    console.log('col is '+ col +'  doc is '+ doc);
    console.log('room is '+ clmn +'  class is'+ cls);
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
