import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { User } from '../auth/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  
  editProfileForm:boolean = false;
  user:User = {
    email:'',
    name:'',
    isTrader:false
  }
  editForm: FormGroup;
  
  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.getUserInfo()
    .subscribe(user =>{
      console.log(user)
        this.user.name = "Name: " + user.name;          
        this.user.email = "Email: " + user.email;
        this.user.isTrader = user.isTrader;
    })

    this.editForm = new FormGroup({
      name: new FormControl(null, {
        validators:[Validators.minLength(6), Validators.maxLength(15), Validators.required]
      })
    })

  }

  editProfile(){
    this.editProfileForm = true;
  }
  closeProfileEditForm(){
    this.editProfileForm = false;
  }

  changeProfile(){
    if(this.editForm.invalid){
      return
    }
    this.editProfileForm = false;
    this.profileService.changeName(this.editForm.value.name)
    .subscribe(result =>{
      this.user.name = "Name: " + result.name;

    })

  }

}
