import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Report } from '../../../models/report.model';
import { UserService } from '../../../data/user.service';
import { Data } from '../../../data/data.service';

@Component({
    selector: 'reports',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit{
    assignId;
    report: Report;
    userId;

    constructor(
        private activatedRoute: ActivatedRoute,
        private userService: UserService,
        private dataBase: Data,
        private location: Location
    ){
        this.report = new Report();
    }

    ngOnInit(){
        this.activatedRoute.params.subscribe((params: Params) => {
            this.assignId = params['id'];
        });
        this.userId = this.userService.getUser().userId;
    }

    onSubmit(reportForm){
        this.report.result = reportForm.result;
        this.report.failureReason = reportForm.failureReason;
        this.report["assignId"] = parseInt(this.assignId);
        this.report["userId"] = this.userId;

        this.dataBase.sendReport(this.report)
            .catch(err => console.log(err));

        this.location.back();
    }
}