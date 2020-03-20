import { Component, OnInit } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  animationImage: any;
  animationText: any;
  constructor() { }

  ngOnInit() {
    this.animationImage = {
      targets: '.image',
      borderRadius: ['0%', '50%'],
      easing: 'easeInOutQuad',
      duration: 1000,
      delay: 500
    };
    this.animationText = {
      targets: '.information',
      keyframes: [
        {translateY: 50},
        {translateY: -50}
      ],
      duration:2000,
      easing: 'easeOutElastic(1, .8)',
      

    }
  }
  ngAfterViewInit(){
    setTimeout(() => {
      anime(this.animationImage);
      //anime(this.animationText)
    })
    
  }


}
