import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'; 
import { Location } from '@angular/common';
import * as moment from 'moment';

import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';
import { Assign } from '../../../models/assign.model';

@Component({
    selector: 'create-assign',
    templateUrl: './create-assign.component.html',
    styleUrls: ['../../../css/common.styles.css', './create-assign.component.css']
})
export class CreateAssignComponent implements OnInit{
    userIdToAssign;
    userToAssign: any = [];
    firmNames: any = [];
    assigns: any = [];   
    showAssignTab: boolean = false;
    showAssignTabLabel: string = 'Show';
    newAssign: Assign;
    newAssignId: any;
    dateNow;

    constructor(
        private dataBase: Data,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventService: EventService,
        private location: Location
    ){
        this.newAssign = new Assign();
    }

    ngOnInit(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.userIdToAssign = params['id'];
          });
        this.dataBase.getUserToAssign(this.userIdToAssign)
            .then(data => {
                this.userToAssign = data.response[0];                
                this.eventService.triggerNotificationFetched(data.message, data.success);
                console.log(this.userToAssign)
            });            
            
        this.dataBase.getFirmNames()
            .subscribe(data => {
                this.firmNames = data.response;
            });  
        this.dataBase.getAssignsForUser(this.userIdToAssign)
            .then(data => {
                this.assigns = data.response;
                this.eventService.triggerNotificationFetched(data.message, data.success);
            });  

            this.dateNow = moment(new Date()).format("YYYY-MM-DD");
    }

    onSubmit(formData){
        formData["employeeAssign"] = parseInt(this.userIdToAssign); 
        this.newAssign = formData;      

        let todayDate = new Date(Date.now());
        let dateFromForm = new Date(this.newAssign.endDate);
    
        if(todayDate < dateFromForm){
            this.dataBase.assignToEmployee(this.newAssign)
            .subscribe(resp => {
                this.newAssignId = resp.response.insertId;
                this.eventService.triggerNotificationFetched(resp.message, resp.success);  
                this.dataBase.getAssignsForUser(this.userIdToAssign)
                        .then(data => {
                            this.assigns = data.response;                           
                        });             
                this.dataBase.setNotification(this.userIdToAssign, this.newAssignId)
                        .then(resp => console.log(resp));
            });
            this.router.navigateByUrl('/');
        } else {
            this.eventService.triggerNotificationFetched("Whong form!", false);
        }
    }

    editAssign(assignId){
        this.router.navigateByUrl(`/assign/edit/${assignId}`)
    }

    deleteAssign(assignId){
        if(confirm('Are you sure?')){
            this.dataBase.deleteAssign(assignId)
                .subscribe(resp => {
                    this.eventService.triggerNotificationFetched(resp.message, resp.success);
                    this.dataBase.getAssignsForUser(this.userIdToAssign)
                        .then(data => {
                            this.assigns = data.response;                           
                        });
                })   
        }
    }

    assignProfile(assignId){
        this.router.navigateByUrl(`assign/profile/${assignId}`);
    }
}