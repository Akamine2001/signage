import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { error } from 'console';
import { ClassroomData, DataService } from '../shared/data.service';

@Component({
  selector: 'app-regist',
  templateUrl: './regist.component.html',
  styleUrls: ['./regist.component.scss']
})

export class RegistComponent implements OnInit{
  matDataSource!: Observable<ClassroomData[]>;
  displayedColumns = this.dataService.displayedColumns
  rowIndex: number = 0;
  columnIndex: number = 0;
  selectedRoomName: string = '';
  selectedCalumn: string ='';
  weekToggle = new FormControl('');
  input = new FormControl('');
  constructor(private dataService: DataService) {
    //this.matDataSource = this.dataService.getFsData();
  };

  onClick(event: MouseEvent, row: number){
    this.rowIndex = row;
    this.columnIndex = (event.target as HTMLTableCellElement).cellIndex;
    this.selectedRoomName = this.dataService.roomName[this.rowIndex];
    this.selectedCalumn = this.dataService.displayedColumns[this.columnIndex];
  }

  selectWeek(){
    const d = this.dataService.getOtherDayData(<string>this.weekToggle.value);
    this.matDataSource = d;
  }

  submit(){
    if(this.weekToggle.value && this.input){
      if(this.input.value == ''){
        this.dataService.editData(this.weekToggle.value, this.selectedRoomName, this.selectedCalumn, 'オープン');
      }else{
        this.dataService.editData(this.weekToggle.value, this.selectedRoomName, this.selectedCalumn, <string>this.input.value);
      }
    }else{
      console.log('submit error');
    }
  }

  ngOnInit(): void {

  }
}

export interface Option {
  value: string;
  viewValue: string;
}
