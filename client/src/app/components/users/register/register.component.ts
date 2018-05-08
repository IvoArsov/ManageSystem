import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../../models/user.model';
import { UserService } from '../../../data/user.service';
import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';


@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['../../../css/common.styles.css', './register.component.css']
})
export class RegisterComponent {
  user: User;
  notification: string;
  
  constructor(
    private data: Data,
    private router: Router, 
    private userService: UserService,    
    private eventService: EventService,
    private location: Location
  ){
    this.user = new User();
    console.log(this.userService.isLoggedIn())
  }
  
  onSubmit(registerUserForm){ 
    registerUserForm = this.user;
    this.data.registerUser(this.user)
    .subscribe(res => {
      if(res.success) {
          this.eventService.triggerStatisticChanged('');
          this.eventService.triggerNotificationFetched(res.message, res.success);
          this.location.back(); 
      } else {
        this.eventService.triggerNotificationFetched(res.message, res.success);      
      }
    });
  }
}