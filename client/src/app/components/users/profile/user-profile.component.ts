import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { Data } from '../../../data/data.service';
import { UserService } from '../../../data/user.service';
import { EventService } from '../../../data/event.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['../../home/home.component.css', './user-profile.component.css']

})
export class UserProfileComponent implements OnInit {
  assigns: any = [];
  total = 0;
  userId: number;
  role: string;
  username: String;
  firstName: String;
  lastName: String;
  tableContainerView: boolean = false;
  viewLabel: string = 'Container';
  notifications: any = [];
  isMarkedNotification: boolean = true;
  activitiesData: any = [];
  allUsers: any = [];
  dateNow;

  constructor(
    private dataBase: Data,
    private userService: UserService,
    private eventService: EventService,
    private router: Router
  ){}

  ngOnInit(){
    this.userId = this.userService.getUser().userId;
    this.username = this.userService.getUser().username;
    this.role = this.userService.getRole();

    this.dataBase
      .getAssignsForUser(this.userId)
      .then(data => {
        this.assigns = data.response;
        this.eventService.triggerNotificationFetched(this.assigns.message, this.assigns.success);
      })
      .catch(err => {
        console.log(err);
        return [];
      });
      
    this.dataBase.getNotifications(this.userId)
      .then(data => {
        this.notifications = data.response;
      })
      .catch(err => console.log(err));
    
    //this.dataBase.getActivitiesById(this.userId)
    //  .then(data => {
    //    this.activitiesData = data.response;
    //  })
    //  .catch(err => console.log(err));

    this.dataBase.getAllUsers()
      .then(data => {
        this.allUsers = data.response;
      })

    this.dateNow = moment(new Date()).format("YYYY-MM-DD");
  }


  showHideTableContainer(){
    if(!this.tableContainerView){
      this.tableContainerView = true;
      this.viewLabel = 'Table';
    }else{
      this.tableContainerView = false;
      this.viewLabel = 'Container';
    }
  }

  deleteFirm(firmId){
      if(confirm("Are you sure?")){
        this.dataBase.deleteFirm(firmId)
          .subscribe(resp => {
              this.dataBase // Must lifecicle hooks
                .getProfileInfoEmployee(this.userId)
                  .then(resp => {
                    this.assigns = resp;        
                    this.firstName = this.assigns.response[0].first_name;
                    this.lastName = this.assigns.response[0].last_name;
                    this.eventService.triggerNotificationFetched(this.assigns.message, this.assigns.success);
                  })
                  .catch(err => {
                    console.log(err);
                    return [];
                  });
          });
      }
  }

  editFirm(firmId){
    this.router.navigateByUrl(`firm/edit/${firmId}`); 
  }

  editAssign(assignId){
    this.router.navigateByUrl(`/assign/edit/${assignId}`)
  }

  deleteAssign(assignId){
    if(confirm('Are you sure?')){
      this.dataBase.deleteAssign(assignId)
        .subscribe(resp => {
          this.eventService.triggerNotificationFetched(resp.message, resp.success);
          this.dataBase
            .getAssignsForUser(this.userId)
            .then(data => {
              this.assigns = data.response;              
            })
            .catch(err => console.log(err));

          this.dataBase.getActivitiesById(this.userId)
            .then(data => {
              this.activitiesData = data.response;
            })
            .catch(err => console.log(err));
        })
    }
  }

  markAsRead(notificationId){
    if(confirm('Are you sure?')){
      this.dataBase.deleteNotification(notificationId)
      .then(resp => {
        this.eventService.triggerNotificationFetched(resp.message, resp.success);
        this.dataBase.getNotifications(this.userId)
          .then(data => {
            this.notifications = data.response;
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    }
  }

  employeeProfilePage(){
    this.router.navigateByUrl('/firm/mine');
  }

  goToAssignProfile(assignId){
    this.router.navigateByUrl(`assign/profile/${assignId}`);
  }

  selfAssign(){
    this.router.navigateByUrl(`/assign/create/${this.userId}`);
  }

  createReport(assignId){
    this.router.navigateByUrl(`/report/create/${assignId}`);
  }

  firmProfile(firmId){
    this.router.navigateByUrl(`firm/profile/${firmId}`);
}

userProfile(userId){
    this.router.navigateByUrl(`assign/create/${userId}`);
}

assignProfile(assignId){
    this.router.navigateByUrl(`assign/profile/${assignId}`)
}
}