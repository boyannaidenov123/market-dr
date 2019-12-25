import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
  progress = 100;
  constructor() { }
  progressBar = document.querySelector('.progress-bar');
  intervalId;

  ngOnInit() {
    console.log(Date());







    const getDownloadProgress = () => {
      //console.log('getDownload', this);
      if (this.progress >= 0) {
        //console.log('inside if', this.progress);
        this.progress = this.progress - 1;
      }
      else {
        clearInterval(this.intervalId);
      }
      if(this.progress == 30){
        this.progress += 50;
      }
    }
    this.intervalId = setInterval(getDownloadProgress, 100);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
