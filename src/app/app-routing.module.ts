import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistComponent } from './regist/regist.component';
import { SignageComponent } from './signage/signage.component';

const routes: Routes = [
  {
    path: '',
    component: SignageComponent
  },{
    path: 'regist',
    component: RegistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
