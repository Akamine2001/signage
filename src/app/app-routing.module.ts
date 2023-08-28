import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistComponent } from './regist/regist.component';
import { SignageComponent } from './signage/signage.component';
import { AuthGuard } from './shared/auth.guard';
import { AdminComponent } from './admin/admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: SignageComponent,
  },{
    path: 'regist',
    component: RegistComponent,
    canActivate: [AuthGuard]
  },{
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
