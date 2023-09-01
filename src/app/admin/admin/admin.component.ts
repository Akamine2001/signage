import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/data.service';
import { User, preUser } from 'src/app/shared/user';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DelConfirmDialogComponent } from '../del-confirm-dialog/del-confirm-dialog.component';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  allUserDatas: User[];
  preUserDatas: preUser[];
  displayedColumns: string[] = ['photoURL', 'displayName', 'email', 'delete'];
  displayedColumnsPreUser: string[] = ['name', 'email', 'delete'];
  dataSource: MatTableDataSource<User>;
  dataSourcePreUser: MatTableDataSource<preUser>;
  registName: string = '';
  registMail: string = '';

  constructor(private dataService: DataService, private authService: AuthService,public dialog: MatDialog, private delDialog:MatDialog){
    this.allUserDatas = this.dataService.userDatas;
    this.preUserDatas = this.dataService.preUserDatas;
    this.dataSource = new MatTableDataSource(this.allUserDatas.slice());
    this.dataSourcePreUser = new MatTableDataSource(this.preUserDatas.slice());
  }

  ngOnInit(): void{
  }

  async deleteUser(n: number, confirm:boolean, colName: string){
    // if t is true then delete Registed User data
    // if t is false then delete Pre user
    if(confirm){
      try{
            if(colName === 'users'){
              await this.authService.deleteUserDataDoc(this.allUserDatas[n].uid, colName);
              this.allUserDatas.splice(n, 1);
              this.dataSource.data = this.allUserDatas.slice();
              console.log(colName + 'コレクションの' + JSON.stringify(this.allUserDatas[n].uid) + 'ドキュメントを削除します。');
              console.log('n is '+ n);
            }else{
              await this.authService.deleteUserDataDoc(this.preUserDatas[n].email, colName);
              this.preUserDatas.splice(n, 1);
              this.dataSourcePreUser.data = this.preUserDatas.slice();
              console.log(colName + 'コレクションの' + JSON.stringify(this.preUserDatas[n].email) + 'ドキュメントを削除します。');
              console.log('n is '+ n);
            }
          } catch(error) {
            console.error('Deleting Error:', error);
          }
    } else {
      console.log('キャンセルしました。');
    }

  }

  openDelDialog(n: number, isUsers: boolean): void {
    const dellDialogRef = this.delDialog.open(DelConfirmDialogComponent, {
      width: '300px'
    });
    dellDialogRef.afterClosed().subscribe(confirm => {
        if(isUsers){
          this.deleteUser(n, confirm, 'users');
        } else {
          this.deleteUser(n, confirm, 'preRegist')
        }
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User data:', result);
        this.registMail = result.email;
        this.registName = result.username;
        this.authService.setNewPreUserDoc(this.registName, this.registMail);
        console.log('user doc created!');
      }
      });
  }
}
