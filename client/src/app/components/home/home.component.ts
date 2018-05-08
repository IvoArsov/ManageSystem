import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
//import { Popup } from 'ng2-opd-popup';

import { Data } from '../../data/data.service';
import { UserService } from '../../data/user.service';
import { EventService } from '../../data/event.service';
import { LoggedInGuard } from '../../directives/logged.in.guard';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['../../css/common.styles.css', './home.component.css']
})
export class HomeComponent implements OnInit {
  data: any = [];    
  token;
  user;
  usersData: any = [];
  role: string = '';
  userId: number = 0;
  isOwner: boolean = false;
  tableContainerView: boolean = false;
  viewLabel: string = 'Container'; 
  usersIsShown: boolean = false;

  constructor(
    private dataBase: Data, 
    private router: Router, 
    private userService: UserService,
    private eventService: EventService,
    private loggedInGuard: LoggedInGuard,
    //private popup: Popup
  ){} 

  ngOnInit(){
    this.dataBase.getAllFirms()
      .subscribe(data => {
        this.data = data.response;
      });     
    this.token = this.userService.getToken();
    this.user = this.userService.getUser();      
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
    if(this.loggedInGuard.canActivate()){
      if(confirm("Are you sure?")){
        this.dataBase.deleteFirm(firmId)
          .subscribe(resp => {
            this.eventService.triggerNotificationFetched(resp.message, resp.success);
            this.dataBase.getAllFirms()
              .subscribe(data => {
                this.data = data.response;
            });
        });
      }
    }
  }

  editFirm(firm){
    this.router.navigateByUrl(`firm/edit/${firm.id}`); 
  }

  firmInfoReceived(receivedData){
    this.data = receivedData;
  }

  createAssign(userId){
    this.router.navigateByUrl(`assign/create/${userId}`); 
  }

  goToAdminPanel(){
    this.router.navigateByUrl('admin-panel');   
  }
  
  firmProfile(firmId){
    this.router.navigateByUrl(`firm/profile/${firmId}`);
  }
}