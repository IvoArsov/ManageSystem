// user.service.ts
import { Injectable, EventEmitter } from '@angular/core';
import { EventService} from './event.service'
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  token;
  user;
  role = '';
  purchasedFlower: Array<{}>;
  purchasedFlowerId;

  constructor(private eventService: EventService, private router: Router) {
    
  }

  setUser(user) {
    //console.log(user)
    this.user = user; 
  }

  getUser() {
    return this.user;
  }

  getRole(){
    return this.user.role;
  }

  getUserId(){
    return this.user.id;
  }

  setToken(token) {
    this.token = token;
    this.eventService.triggerUserLoggedIn(this.user.username);
  }  
  
  getToken() {
    return this.token;
  }

  isLoggedIn() {
    return !!this.token;
  }  

  logout(){
    this.token = '';
    this.setToken(this.token)
    this.user = {};
    this.router.navigateByUrl('/');
  }
}