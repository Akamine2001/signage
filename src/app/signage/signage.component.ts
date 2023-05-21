import {  AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService,ClassroomData } from '../shared/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signage',
  templateUrl: './signage.component.html',
  styleUrls: ['./signage.component.scss']
})
export class SignageComponent implements OnInit,AfterViewInit,OnDestroy{
  ngOnInit(): void {
  this.weatherData = this.dataService.weatherData;
  }

  ngOnDestroy(){

  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.getPeriod();
      this.currentTime = new Date();
    }, this.highlightDuraration);
  }

  constructor(private dataService: DataService){
    this.matDataSource = this.dataService.getFsData();
  }

  currentColumn = 1; //強調表示する列
  highlightDuraration = 1000; //更新の頻度(ms)
  nowPeriod: string ='';
  currentTime: Date = new Date();
  todaysWeek: string = this.dataService.weekDataJp[this.currentTime.getDay()];
  matDataSource: Observable<ClassroomData[]>;
  displayedColumns = this.dataService.displayedColumns;
  weatherData: string | undefined;

  isOpen(cell: string): boolean{
    if(cell == 'オープン'){
      return true;
    }
    return false
  }

  getPeriod(){
    let nowMinSec:number = (this.currentTime.getHours() * 100) + (this.currentTime.getMinutes());
    if(nowMinSec < 845){
      this.nowPeriod = '朝';
      this.currentColumn = 0;
    }else if(nowMinSec < 1015){
      this.nowPeriod = '1限';
      this.currentColumn = 1;
    }else if(nowMinSec < 1200){
      this.nowPeriod = '2限';
      this.currentColumn = 2;
    }else if(nowMinSec < 1300){
      this.nowPeriod = '昼休み';
      this.currentColumn = 3;
    }else if(nowMinSec < 1430){
      this.nowPeriod = '3限';
      this.currentColumn = 4;
    }else if(nowMinSec < 1615){
      this.nowPeriod = '4限';
      this.currentColumn = 5;
    }else if(nowMinSec < 1800){
      this.nowPeriod = '5限';
      this.currentColumn = 6;
    }else if(nowMinSec < 1945){
      this.nowPeriod = '6限';
      this.currentColumn = 7;
    }else{
      this.nowPeriod = "時間外";
        this.currentColumn = 8;
    }
  }
}
