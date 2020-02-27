import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Time } from './time.model';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  startDate = new Date();
  startTime;
  auction: string = 'Sofia';

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  changeStartTime(form:NgForm){
    const hour = this.startTime.replace(':',' ').split(" ")[0];
    const minute = this.startTime.replace(':',' ').split(" ")[1];
    const date = new Date(this.startDate.setHours(hour, minute, 0, 0));
    console.log(date);
    const time:Time = {
      date: date,
      auction: this.auction
    };
    this.adminService.changeStartTimeAuctions(time)
    .subscribe((res) =>{});
  }
  auctions = [
    {value: 'Sofia'},
    {value: 'Plovdiv'},
    {value: 'Varna'}
  ];
}
