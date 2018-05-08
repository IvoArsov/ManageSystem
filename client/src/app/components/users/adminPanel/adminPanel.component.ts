import { Component, OnInit, OnChanges, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';
import { LoggedInGuard } from '../../../directives/logged.in.guard';
import { Search } from '../../../models/search.model';

@Component({
    selector: 'admin-panel',
    templateUrl: './adminPanel.component.html',
    styleUrls: ['./adminPanel.component.css']
})
export class AdminPanelComponent implements OnInit {
    employeesWithAssign: any;
    employeesView: boolean = false;
    firmsWithAssign: any;
    firmsView: boolean = false;
    activitiesView: boolean = false;
    assignsView: boolean = false;
    reportsView: boolean = false;
    reportsData: any;
    firmsWithoutAssign: any;
    employeesWithoutAssign: any;
    allAssigns: any;
    activitiesData: any;
    searchResult: any = {};
    search: Search;
    searchResultFirm: any = [];
    searchResultEmployee: any = [];
    searchResultAssign: any = [];
    dateNow;
    nothingFoundLabel: boolean = false;

    constructor(
        private dataBase: Data,
        private eventService: EventService,
        private router: Router,
        private loggedInGuard: LoggedInGuard
    ) {
        this.search = new Search();
    }

    ngOnInit() {
        this.dataBase.getEmployeesWithAssign()
            .subscribe(data => {
                this.employeesWithAssign = data.response;
            });

        this.dataBase.getEmployeeWithoutAssign()
            .subscribe(data => {
                this.employeesWithoutAssign = data.response;
            });

        this.dataBase.getFirmsWithAssign()
            .subscribe(data => {
                this.firmsWithAssign = data.response;
            });

        this.dataBase.getFirmsWithoutAssign()
            .subscribe(data => {
                this.firmsWithoutAssign = data.response;
            });

        this.dataBase.getAllAssigns()
            .subscribe(data => {
                this.allAssigns = data.response;
            });

        this.dataBase.getAllReports()
            .subscribe(data => {
                this.reportsData = data.response;
                this.eventService.triggerNotificationFetched(data.message, data.success);
            });

        this.dataBase.getAllActivities()
            .subscribe(data => {
                this.activitiesData = data.response;
            });

        this.reportsView = true;

        this.dateNow = moment(new Date()).format("YYYY-MM-DD");
    }

    onSubmit(searchForm) {
        this.searchResult = searchForm;
        this.dataBase.adminSearch(searchForm)
            .subscribe(data => {
                if (searchForm.type === 'byFirm' || searchForm.type === undefined) {
                    this.searchResultFirm = data.response;
                    this.searchResultEmployee = [];
                    this.searchResultAssign = [];
                } else if (searchForm.type === 'byEmployee') {
                    this.searchResultEmployee = data.response;
                    this.searchResultFirm = [];
                    this.searchResultAssign = [];
                } else if (searchForm.type === 'byAssign') {
                    this.searchResultAssign = data.response;
                    this.searchResultFirm = [];
                    this.searchResultEmployee = [];
                }

                if(this.searchResultFirm.length === 0 && 
                   this.searchResultEmployee.length === 0 && 
                   this.searchResultAssign.length === 0){
                       this.nothingFoundLabel = true;
                   } else {
                       this.nothingFoundLabel = false;
                   }
            });
    }

    deleteUser(userId) {
        if (confirm('Are you sure?')) {
            this.dataBase.deleteUser(userId)
                .subscribe(resp => {
                    this.eventService.triggerNotificationFetched(resp.message, resp.success);
                    this.dataBase.getEmployeesWithAssign()
                        .subscribe(data => {
                            this.employeesWithAssign = data.response;
                        });
                    this.dataBase.getEmployeeWithoutAssign()
                        .subscribe(data => {
                            this.employeesWithoutAssign = data.response;
                        });
                });
        }
    }

    deleteReport(reportId) {
        if (confirm('Are you sure?')) {
            this.dataBase.deleteReport(reportId)
                .subscribe(resp => {
                    this.eventService.triggerNotificationFetched(resp.message, resp.success);
                    this.dataBase.getAllReports()
                        .subscribe(data => {
                            this.reportsData = data.response;
                        });
                });
        }
    }

    deleteAssign(assignId, userId) {
        if (confirm('Are you sure?')) {
            this.dataBase.deleteAssign(assignId)
                .subscribe(resp => {
                    this.eventService.triggerNotificationFetched(resp.message, resp.success);
                    this.dataBase.getAllAssigns()
                        .subscribe(data => {
                            this.allAssigns = data.response;
                        });
                });
        }
    }

    createAssign(userId) {
        this.router.navigateByUrl(`assign/create/${userId}`);
    }

    editAssign(assignId) {
        this.router.navigateByUrl(`/assign/edit/${assignId}`)
    }

    goToRegisterUser() {
        this.router.navigateByUrl('register');
    }

    showEmployeesView() {
        if (this.employeesView === false) {
            this.employeesView = true;
            this.eventService.triggerNotificationFetched("Employees list!", true);
            this.firmsView = false;
            this.activitiesView = false;
            this.assignsView = false;
            this.reportsView = false;
        } else {
            this.employeesView = false;
        }
    }

    showFirmsView() {
        if (this.firmsView === false) {
            this.firmsView = true;
            this.eventService.triggerNotificationFetched("Firms list!", true);
            this.employeesView = false;
            this.activitiesView = false;
            this.assignsView = false;
            this.reportsView = false;
        } else {
            this.firmsView = false;
        }
    }

    showActivitiesView() {
        if (this.activitiesView === false) {
            this.activitiesView = true;
            this.eventService.triggerNotificationFetched("Activities list!", true);
            this.firmsView = false;
            this.employeesView = false;
            this.assignsView = false;
            this.reportsView = false;
        } else {
            this.activitiesView = false;
        }
    }

    showAssignsView() {
        if (this.assignsView === false) {
            this.assignsView = true;
            this.eventService.triggerNotificationFetched("Assigns list!", true);
            this.firmsView = false;
            this.employeesView = false;
            this.activitiesView = false;
            this.reportsView = false;
        } else {
            this.assignsView = false;
        }
    }

    showReportsView() {
        if (this.reportsView === false) {
            this.reportsView = true;
            this.eventService.triggerNotificationFetched("Reports list!", true);
            this.firmsView = false;
            this.employeesView = false;
            this.activitiesView = false;
            this.assignsView = false;
        } else {
            this.reportsView = false;
        }
    }

    deleteFirm(firmId) {
        if (this.loggedInGuard.canActivate()) {
            if (confirm("Are you sure?")) {
                this.dataBase.deleteFirm(firmId)
                    .subscribe(resp => {
                        this.eventService.triggerNotificationFetched(resp.message, resp.success);
                        this.dataBase.getFirmsWithAssign()
                            .subscribe(data => {
                                this.firmsWithAssign = data.response;
                            });
                        this.dataBase.getFirmsWithoutAssign()
                            .subscribe(data => {
                                this.firmsWithoutAssign = data.response;
                            });
                    });
            }
        }
    }

    editFirm(firmId) {
        this.router.navigateByUrl(`firm/edit/${firmId}`);
    }

    firmProfile(firmId) {
        this.router.navigateByUrl(`firm/profile/${firmId}`);
    }

    userProfile(userId) {
        this.router.navigateByUrl(`assign/create/${userId}`);
    }

    assignProfile(assignId) {
        this.router.navigateByUrl(`assign/profile/${assignId}`)
    }

    createAssignByFirm(firmId) {
        this.router.navigateByUrl(`firm/assign/${firmId}`);
    }

    clearSearchResults() {
        this.searchResultFirm = [];
        this.searchResultEmployee = [];
        this.searchResultAssign = [];
        this.nothingFoundLabel = false;
    }
}