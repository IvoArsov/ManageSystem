import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';
import { UserService } from '../../../data/user.service';

@Component({
    selector: 'profile-firm',
    templateUrl: './profile-firm.component.html',
    styleUrls: ['./profile-firm.component.css']
})
export class ProfileFirmComponent implements OnInit {
    firmData: any = {};
    firmAssigns: any;
    firmId;
    userRole: string = '';
    dateNow;

    constructor(
        private activatedRoute: ActivatedRoute,
        private dataBase: Data,
        private eventService: EventService,
        private router: Router,
        private userService: UserService,
        private location: Location
    ){}

    ngOnInit(){
        this.userRole = this.userService.getRole();
        this.activatedRoute.params.subscribe((params: Params) => {
            this.firmId = params['id'];
        });
        
        this.dataBase.findFirmById(this.firmId)
            .then(data => {
                this.firmData = data.response;
            
                this.eventService.triggerNotificationFetched("Firm info!", data.success);
            })
            .catch(err => console.log(err));
        this.dataBase.getAssignsForFirm(this.firmId)
            .then(data => {
                this.firmAssigns = data.response;       
            })
            .catch(err => console.log(err));

        this.dateNow = moment(new Date()).format("YYYY-MM-DD");        
    }

    createAssignByFirm(){
        this.router.navigateByUrl(`firm/assign/${this.firmId}`);
    }

    editFirm(){
        this.router.navigateByUrl(`firm/edit/${this.firmId}`);
    }

    deleteFirm(){
        if(confirm('Are you sure?')){
            this.dataBase.deleteFirm(this.firmId)
                .subscribe(resp => {
                    this.eventService.triggerNotificationFetched(resp.message, resp.success);  
                    if(resp.success === true){
                        this.location.back();
                    } 
                });    
        }
    }

    editAssign(assignId){
        this.router.navigateByUrl(`/assign/edit/${assignId}`)
    }

    deleteAssign(assignId, userId){
        if(confirm('Are you sure?')){
            this.dataBase.deleteAssign(assignId)
                .subscribe(resp => {
                    this.eventService.triggerNotificationFetched(resp.message, resp.success);
                    this.dataBase.getAssignsForFirm(this.firmId)
                    .then(data => {
                        this.firmAssigns = data.response;
                    })
                    .catch(err => console.log(err));
                });
        }
    }

    assignProfile(assignId){
        this.router.navigateByUrl(`assign/profile/${assignId}`);
    }
}