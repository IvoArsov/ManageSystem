import { Component, OnInit, OnChanges, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
declare var $: any;

import { UserService } from '../../data/user.service';
import { EventService} from '../../data/event.service';

@Component({
  selector: 'nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn = false; 
  username = "";  
  userRole;

  constructor(
    private userService: UserService,
    private router: Router, 
    private eventService: EventService,   
    public toastr: ToastsManager,
    public vcr: ViewContainerRef 
  ){  
    this.loggedIn = userService.isLoggedIn();
    //console.log(this.loggedIn);
     this.toastr.setRootViewContainerRef(vcr);    
  }

  ngOnInit() {
    this.eventService.userLoggedIn.subscribe(
      (username) => {
        this.loggedIn = this.userService.isLoggedIn();
        this.username=username;
        this.userRole = this.userService.getRole();
      }
    ); 

    this.eventService.notificationFetched.subscribe(
      (notificationInfo) => {
        let message = notificationInfo.message;
        let status = notificationInfo.status;
        if(status === true){
          this.toastr.success(message, 'Success!');
        }
        if(status === false){
          this.toastr.error(message, 'Error!')
        }        
      }
    );   

    $(document).ajaxStart(() => {
      console.log("ajax start");
      $("#loading").show();
    }) 
  }  

  logout(){
    this.userService.logout();
    this.username = '';
    this.toastr.success('Logout Success!', 'Success!')
  }

  getUser(){
    this.router.navigateByUrl(`firm/mine`);
  }  
}