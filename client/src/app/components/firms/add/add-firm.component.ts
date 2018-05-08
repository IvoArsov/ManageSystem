import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NgForm } from '@angular/forms';

import { Data } from '../../../data/data.service';
import { Firm } from '../../../models/firm.model';
import { EventService } from '../../../data/event.service';
import { UserService } from '../../../data/user.service';


@Component({
    selector: 'add-firm',
    templateUrl: './add-firm.component.html',
    styleUrls: ['../../../css/common.styles.css', './add-firm.component.css']
})
export class AddFirmComponent{
    firm: any;
    userId: any;

    constructor(
        private router: Router,
        private eventService: EventService, 
        private data: Data,
        private userService: UserService,
        private http: Http
        ){
            this.firm = new Firm();
            this.userId = userService.getUser().userId;
    }

    onSubmit(firm){
        this.firm = firm.form._value;
        this.firm['userId'] = this.userId;

        this.data.addFirm(this.firm)
            .then((res) => {
                this.router.navigateByUrl('/');     
                this.eventService.triggerNotificationFetched(res.message, res.success);
            });      
    }
}