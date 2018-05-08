import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';
import { UserService } from '../../../data/user.service';

@Component({
    selector: 'assign-profile',
    templateUrl: './assign-profile.component.html',
    styleUrls: ['./assign-profile.component.css']
})
export class AssignProfileComponent implements OnInit{
    assignData: any = {};
    assignId;
    userId;
    userRole: string;
    dateCondition: boolean = true;

    constructor(
        private dataBase: Data,
        private activatedRoute: ActivatedRoute,
        private eventService: EventService,
        private userService: UserService,
        private router: Router
    ){}

    ngOnInit(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.assignId = params['id'];
          });
        
        this.userRole = this.userService.getRole();
        this.userId = this.userService.getUser().userId;

        this.dataBase.getAssignById(this.assignId)
          .then(data => {
              this.assignData = data.response;
              this.eventService.triggerNotificationFetched(data.message, data.success);
              
              let todayDate = new Date(Date.now());
              let dateFromForm = new Date(this.assignData.end_date);
              if(todayDate > dateFromForm){
                this.dateCondition = false;
              } else{
                  this.dateCondition = true;
              }
          })
          .catch(err => console.log(err));
    }

    firmProfile(firmId){
        this.router.navigateByUrl(`firm/profile/${firmId}`);
    }

    editAssign(){
        this.router.navigateByUrl(`/assign/edit/${this.assignId}`)
    }

    deleteAssign(){
        if(confirm('Are you sure?')){
            this.dataBase.deleteAssign(this.assignId)
                .subscribe(resp => {
                    console.log(resp)
                    this.eventService.triggerNotificationFetched(resp.message, resp.success);
                    if(resp.success === true){
                        this.router.navigateByUrl('/'); 
                    }
                });
        }
    }
}