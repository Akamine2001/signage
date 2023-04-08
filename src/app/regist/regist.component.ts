import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { error } from 'console';

interface ClassroomData{
  roomName: string;
  period1: string;
  period2: string;
  lunch: string;
  period3: string;
  period4: string;
  period5: string;
  period6: string;
  [key: string]: string;
}

@Component({
  selector: 'app-regist',
  templateUrl: './regist.component.html',
  styleUrls: ['./regist.component.scss']
})

export class RegistComponent implements OnInit{
  firebaseData: any;
  formGroup: FormGroup;
  showForms: boolean[] = [false, false, false, false, false];
  options: Option[] = [
    {value: 'period1', viewValue: '1限'},
    {value: 'period2', viewValue: '2限'},
    {value: 'period3', viewValue: '3限'},
    {value: 'period4', viewValue: '4限'},
    {value: 'period5', viewValue: '5限'},
    {value: 'period6', viewValue: '6限'},
  ];
  roomData: unknown[] | undefined;
  constructor(private firestore: AngularFirestore) {
    this.formGroup = new FormGroup({
      className: new FormControl(''),
      period1: new FormControl(''),
      period2: new FormControl(''),
      lunch: new FormControl(''),
      period3: new FormControl(''),
      period4: new FormControl(''),
      period5: new FormControl(''),
      period6: new FormControl(''),
    })
    this.firestore.collection('classroomData').doc('Ad6m6d7kxwRjgEUSztjE')
    .valueChanges().subscribe(value => {
      console.log(value);
      this.firebaseData = value;
    }),() => {
      console.log('subscribe Error');
    }
  };

  addClass(i :number){
    this.showForms[i] = true;
  }

  ngOnInit(): void {
    //console.log(this.item);
  }
}

export interface Option {
  value: string;
  viewValue: string;
}
