import {  Component } from '@angular/core';
import screenfull from 'screenfull';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'meio-classroom-info';
  isFullscreen: boolean = false;

  constructor(public auth: AuthService){}

  fullscreen(){
    if(this.isFullscreen == false){
      if (screenfull.isEnabled) {
        screenfull.request();
      }else{
        console.log('fullScreen is not available...');
      }
      this.isFullscreen = true;
    }
  }

  exitFullscreen(){
    if(this.isFullscreen){
      if(screenfull.isEnabled){
         screenfull.exit();
      }else{
        console.log('fullScreen is not available...');
      }
      this.isFullscreen = false;
    }
  }

}
