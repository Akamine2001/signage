import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DataService,ClassroomData } from '../shared/data.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signage',
  templateUrl: './signage.component.html',
  styleUrls: ['./signage.component.scss']
})
export class SignageComponent implements OnInit,AfterViewInit,AfterContentInit{
  ngOnInit(): void {

  }

  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {
    setInterval(() => {
      this.getPeriod();
      //this.updateCurrentColumn();
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

  matDataSource: Observable<ClassroomData[]>;
  displayedColumns = this.dataService.displayedColumns;

  private readonly startHour = 8;
  private readonly startMinute = 45;
  private readonly endHour = 19;
  private readonly endMinute = 45;

  getProgress(): number {
    const now = new Date();
    const start = new Date();
    start.setHours(this.startHour, this.startMinute, 0, 0);
    const end = new Date();
    end.setHours(this.endHour, this.endMinute, 0, 0);
    if (now < start) {
      return 0;
    } else if (now > end) {
      return 100;
    } else {
      const totalMinutes = (end.getTime() - start.getTime()) / 60000;
      const elapsedMinutes = (now.getTime() - start.getTime()) / 60000;
      console.log("endTime:"+ end.getHours() +":" + end.getMinutes());
      console.log("nowTime:"+ now.getHours() +":" + now.getMinutes());
      return (elapsedMinutes / totalMinutes) * 100;
    }
  }

  getPeriod(){
    let nowMinSec:number = (this.currentTime.getHours() * 100) + (this.currentTime.getMinutes());
    //console.log(nowMinSec);
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

  updateCurrentColumn(){
    this.currentColumn = this.currentColumn < 9 ? this.currentColumn + 1 : 1;
  }

}
