import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { User } from '../auth/user.model';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  user:User = {
    email:'',
    name:'',
    isTrader:false
  }
  
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getUserInfo()
    .subscribe(user =>{
      console.log(user)
        this.user.name = user.name;          
        this.user.email = user.email;
        this.user.isTrader = user.isTrader;
    })



  }

  changeName(form:NgForm){
    if(form.invalid){
      return;
    }
    console.log(form.value.name);
    this.profileService.changeName(form.value.name)
    .subscribe(result=>{
      this.user.name = result.name;
      form.reset();
    })
  }

  changePassword(form:NgForm){
    if(form.invalid){
      return;
    }
    console.log(form.value.password)
    this.profileService.changePassword(form.value.password, form.value.newPassword)
    .subscribe(result=>{
      console.log(result.message);
    })
  }

}
