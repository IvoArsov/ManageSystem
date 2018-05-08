import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
declare var $: any;

import { Assign } from '../../../models/assign.model';
import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';
import { UserService } from '../../../data/user.service';

@Component({
    selector: 'edit-assign',
    templateUrl: './edit-assign.component.html',
    styleUrls: ['../../../css/common.styles.css', './edit-assign.component.css']
})
export class EditAssignComponent implements OnInit{
    assign: Assign;
    assignId;
    editedAssignData;
    assignTask: string;
    assignEndDate: string;
    assignFirm: string;
    assignNotes: string;
    assignStatus: string;
    userRole;
    employeeId;

    constructor(
        private dataBase: Data,
        private eventService: EventService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private location: Location
    ){
        this.assign = new Assign();
    }

    ngOnInit(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.assignId = params['id'];
        });

        this.dataBase.findAssignById(this.assignId)
            .then(data => {
                this.employeeId = data.response.user_id;  
                this.assignTask = data.response.task;
                this.assignEndDate = data.response.end_date;
                this.assignFirm = data.response.firm;
                this.assignNotes = data.response.notes;
                this.assignStatus = data.response.status;               
            })

        this.userRole = this.userService.getRole(); 
    }

    onSubmit(editAssign){
        this.editedAssignData = editAssign;
        this.editedAssignData.task = $('#task').val();
        this.editedAssignData.endDate = $('#end-date').val();
        this.editedAssignData.firm = this.assignFirm;
        this.editedAssignData.notes = this.assignNotes + '\n' +  $('#notes').val();
        this.editedAssignData.status = $('#status').val();
        this.editedAssignData['id'] = this.assignId;
        
        let todayDate = new Date(Date.now());
        let dateFromForm = new Date(this.editedAssignData.endDate);
    
        if(todayDate < dateFromForm){
            this.dataBase.editAssign(this.editedAssignData)
                .then(resp => {
                    this.eventService.triggerNotificationFetched(resp.message, resp.success);
                    this.dataBase.setNotification(this.employeeId, this.assignId)
                        .then()
                        .catch(err => console.log(err));
                    this.location.back();
                });  
        } else {
            this.eventService.triggerNotificationFetched('Wrong form!', false);    
        }        
    }
}