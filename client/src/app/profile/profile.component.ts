import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { User } from '../auth/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  editForm:boolean = false;
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
        if(!name){
          this.user.name = "Name: none";
        }else{
        this.user.name = "Name: " + user.name;          
        }

        this.user.email = "Email: " + user.email;
        this.user.isTrader = user.isTrader;
    })
  }

  editProfile(){
    this.editForm = true;
  }

}
