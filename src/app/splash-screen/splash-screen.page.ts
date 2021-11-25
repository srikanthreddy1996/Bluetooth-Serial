import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.page.html',
  styleUrls: ['./splash-screen.page.scss'],
})
export class SplashScreenPage implements OnInit {

  constructor(public router:Router) { 
  }

  ngOnInit() {
  }
  ngAfterViewInit(){
    setTimeout(function () {
      $(".first_box").animate({ opacity: 0 }, 200);
      $('.first_box').css('display','none');
      $(".second_box").animate({ opacity: 1 }, 800);
    }, 1000);
    setTimeout(()=>{
      this.router.navigateByUrl('bluetooth-serial');
    },2000);
  }

}
