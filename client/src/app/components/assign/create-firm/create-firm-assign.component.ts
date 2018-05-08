import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';
import { Assign } from '../../../models/assign.model';

@Component({
    selector: 'create-firm-assign',
    templateUrl: './create-firm-assign.component.html',
    styleUrls: ['../../../css/common.styles.css', './create-firm-assign.component.css']
})
export class CreateFirmAssignComponent implements OnInit{
    firmId;
    allEmployees: any;
    newAssign: Assign;
    userIdToAssign: number;
    newAssignId;

    constructor(
        private activatedRoute: ActivatedRoute,
        private dataBase: Data,
        private eventService: EventService,
        private location: Location
    ){
        this.newAssign = new Assign();
    }

    ngOnInit(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.firmId = params['id'];
        });

        this.dataBase.getAllUsers()
            .then(data => {
                this.allEmployees = data.response;
            })
            .catch(err => console.log(err));
    }

    onSubmit(formData){
        formData["firmAssign"] =  parseInt(this.firmId); 
        this.newAssign = formData;    
        this.userIdToAssign = formData.employeeAssign;  

        let todayDate = new Date(Date.now());
        let dateFromForm = new Date(this.newAssign.endDate);
    
       if(todayDate < dateFromForm){
           this.dataBase.assignToEmployee(this.newAssign)
           .subscribe(resp => {
                this.newAssignId = resp.response.insertId;
                this.dataBase.setNotification(this.userIdToAssign, this.newAssignId);
               this.eventService.triggerNotificationFetched(resp.message, resp.success);
               if(this.newAssign.secondEmployeeAssign !== undefined){
                   this.newAssign.employeeAssign = this.newAssign.secondEmployeeAssign;
                   this.dataBase.assignToEmployee(this.newAssign)
                    .subscribe(resp => {
                        this.userIdToAssign = this.newAssign.employeeAssign;
                        this.newAssignId = resp.response.insertId;
                        this.dataBase.setNotification(this.userIdToAssign, this.newAssignId);
                        this.eventService.triggerNotificationFetched(resp.message, resp.success);
                    });
               }              
           });
       } else {
           this.eventService.triggerNotificationFetched("Whong form!", false);
       }
       this.location.back();
    }
}