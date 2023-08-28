import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { User } from 'src/app/shared/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  allUserDatas: User[] = [];
  displayedColumns: string[] = ['photoURL', 'displayName', 'email'];
  dataSource: MatTableDataSource<User>;
  registName: string = '';
  registMail: string = '';

  constructor(private dataService: DataService, private authService: AuthService,public dialog: MatDialog){
    this.allUserDatas = this.dataService.userDatas;
    this.dataSource = new MatTableDataSource(this.allUserDatas);
  }

  ngOnInit(): void{
    this.allUserDatas = this.dataService.userDatas;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User data:', result);
        this.registMail = result.email;
        this.registName = result.username;
        this.authService.setNewUserDoc(this.registName, this.registMail);
        console.log('user doc created!');
      }
    });
  }
}
