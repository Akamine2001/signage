import {  Component } from '@angular/core';
import screenfull from 'screenfull';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'meio-classroom-info';
  isFullscreen: boolean = false;

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
