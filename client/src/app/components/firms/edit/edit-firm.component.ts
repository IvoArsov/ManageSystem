import { Component, OnInit, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
declare var $: any;

import { Firm } from '../../../models/firm.model';
import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';

@Component({
    selector: 'edit-firm',
    templateUrl: './edit-firm.component.html',
    styleUrls: ['../../../css/common.styles.css', 'edit-firm.component.css']
})
export class EditFirmComponent implements OnInit{
    firm: Firm;
    firmId: number;
    firmName: string;
    firmUniqueIdentifier: string;
    firmAddress: string;
    firmContactPerson: string;
    firmContacts: string;
    firmWebsite: string;
    firmEmail: string;
    firmTown: string;
    firmFieldOfWork: string;
    firmComments: string;
    
    constructor(
        private activatedRoute: ActivatedRoute,
        private dataBase: Data,
        private router: Router,
        private eventService: EventService,
        private location: Location
    ){
        this.firm = new Firm();
    }

    ngOnInit(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.firmId = params['id'];
          });

        this.dataBase.findFirmById(this.firmId)
            .then(data => {
                this.firm = data.response;
                this.firmName = this.firm.firm;
                this.firmUniqueIdentifier = data.response.unique_identifier;
                this.firmAddress = data.response.address;
                this.firmContactPerson = data.response.contact_person;
                this.firmContacts = data.response.contacts;
                this.firmWebsite = data.response.website;
                this.firmEmail = data.response.email;
                this.firmTown = data.response.town;
                this.firmFieldOfWork = data.response.field_of_work;
                this.firmComments = data.response.comments;
            });
    }

    onSubmit(editFirmForm){
        this.firm  = editFirmForm.form._value;
        this.firm.firm = $('#firm').val();
        this.firm.uniqueIdentifier = $('#uniqueIdentifier').val();
        this.firm.address = $('#address').val();
        this.firm.contactPerson = $('#contactPerson').val();
        this.firm.contacts = $('#contacts').val();
        this.firm.website = $('#website').val();
        this.firm.email = $('#email').val();
        this.firm.town = $('#town').val();
        this.firm.fieldOfWork = $('#fieldOfWork').val();
        this.firm.comments = $('#comments').val();
        this.firm['id'] = this.firmId;

        this.dataBase.editFirm(this.firm)
            .then(resp => {
                this.location.back();
                this.eventService.triggerNotificationFetched(resp.message, resp.success);
            })
            .catch(err => {
                console.log(err);
            });

    } 
}