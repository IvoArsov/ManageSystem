import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../models/user.model';
import { UserService } from '../../../data/user.service';
import { EventService } from '../../../data/event.service';
import { Data } from '../../../data/data.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../css/common.styles.css', './login.component.css']
})
export class LoginComponent {
  user: User;
  token: any;
  notification: string;
  
  constructor(
    private data: Data,
    private router: Router, 
    private userService: UserService,    
    private eventService: EventService
  ){
    this.user = new User();
  }

  onSubmit(loginFormUser){
    loginFormUser = this.user;
    
    this.data.loginUser(this.user).subscribe((res) => {      
      this.router.navigateByUrl('/');     
      this.eventService.triggerNotificationFetched(res.message, res.success);      
    });
  }  
}