import { Injectable }from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise'; 
import 'rxjs/add/operator/map';

import { User } from '../models/user.model';
import { UserService } from './user.service';
import { EventService } from './event.service';

const baseUrl = 'http://localhost:5000';

@Injectable()
export class Data{
  data;

  constructor (
    private http: Http, 
    private userService: UserService, 
    private eventService: EventService
  ) {}

  getAllFirms() {
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/firms/all`, { headers })
      .map(resp => {
        return resp.json();
      });
  }  

  getAssignsForFirm(firmId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/firms/assigns/${firmId}`, { headers })
      .toPromise()
      .then(resp => resp.json())
      .catch(err => { 
         console.log(err);
         return [];
      });
  }

  getFirmsWithoutAssign(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/firms/1/noAssign`, { headers })
      .map(resp => {
        return resp.json();
      });
  }

  getFirmsWithAssign(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/firms/1/withAssign`, { headers })
      .map(resp => {
        return resp.json();
      });
  }

  getAllAssigns(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/assign/1/all`, { headers })
      .map(resp => {
        return resp.json();
      });
  } 
  
  getEmployeeWithoutAssign(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/auth/1/noAssign`, { headers })
      .map(resp => {
        return resp.json();
      });
  }

  getEmployeesWithAssign(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/auth/1/withAssign`, { headers })
      .map(resp => {
        return resp.json();
      });
  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `nUwdaa*=632Ate`);   

      let body = {     
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: user.password
    };    

    return this.http
      .post(`${baseUrl}/auth/signup`, body, { headers })
      .map(res => {
        return res.json()
      });
  }  

  addFirm(firm){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .post(`${baseUrl}/firms/add`, firm, { headers })
      .toPromise()
      .then(resp => resp.json())
      .catch(err => { 
        console.log(err);
        return [];
      });
  }

  addFirmViaXlsx(fileToUpload, headers){
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    return this.http
          .post(`${baseUrl}/firms/add/xlsx`, fileToUpload, headers)
          .toPromise()
          .then(resp => resp.json())
          .catch(err => { 
            console.log(err);
            return [];
          }); //////////////not work
  }

  loginUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `nUwdaa*=632Ate`);

    let body = {
      username: user.username,
      password: user.password
    }

    return this.http
      .post(`${baseUrl}/auth/login`, body, { headers })
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          this.userService.setUser(res.user);
          this.userService.setToken(res.token);
          //this.userService.setRole(res.user.role);          
        }

        return res;
      });    
  }

  getAllUsers(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/auth/all`, { headers })
      .toPromise()
      .then(resp => resp.json())
      .catch(err => { 
         console.log(err);
         return [];
      });
  }

  getProfileInfoEmployee(userId): Promise<Array<{}>> {
    let authToken = this.userService.getToken(); 
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

   return this.http
      .get(`${baseUrl}/firms/mine/${userId}`, { headers })
      .toPromise()
      .then(resp => resp.json())
      .catch(err => { 
         console.log(err);
         return [];
      });
  } 

  findFirmById(firmId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
        .get(`${baseUrl}/firms/${firmId}`, { headers })
        .toPromise()
        .then(resp => resp.json())
        .catch(err => {
          console.log(err);
          return [];
        })  
  }

  editFirm(firmData){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
          .post(`${baseUrl}/firms/edit/${firmData.id}`, firmData, { headers })
          .toPromise()
          .then(resp => resp.json())
          .catch(err => {
            console.log(err);
            return [];
          })
  }

  deleteFirm(firmId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .delete(`${baseUrl}/firms/delete/${firmId}`, { headers })
      .map(resp => {
        return resp.json();
      });
  }

  search(searchParam){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    let body = {
      param: searchParam.searchParam,
      type: searchParam.type
    };

    return this.http
            .post(`${baseUrl}/firms/search`, body, { headers })
            .map(res => {
              return res.json()
            });
  }

  getUserToAssign(employeeId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
        .get(`${baseUrl}/assign/${employeeId}`, { headers })
        .toPromise()
        .then(resp => resp.json())
        .catch(err => {
          console.log(err);
          return [];
        })  
  }

  getAssignsForUser(employeeId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
        .get(`${baseUrl}/assign/user/${employeeId}`, { headers })
        .toPromise()
        .then(resp => resp.json())
        .catch(err => {
          console.log(err);
          return [];
        }) 
  }

  getFirmNames(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
        .get(`${baseUrl}/assign/new/firms-info`, { headers })
        .map(res => {
          return res.json()
        });
  }

  assignToEmployee(data){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
            .post(`${baseUrl}/assign/new/create`, data, { headers })
            .map(res => {
              return res.json()
            });

  }

  findAssignById(assignId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/assign/find/${assignId}`, { headers })
      .toPromise()
      .then(resp => resp.json())
      .catch(err => {
        console.log(err);
        return [];
      })
  }
  
  editAssign(editAssignData){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
          .post(`${baseUrl}/assign/edit/${editAssignData.id}`, editAssignData, { headers })
          .toPromise()
          .then(resp => resp.json())
          .catch(err => {
            console.log(err);
            return [];
          })
  }

  deleteAssign(assignId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .delete(`${baseUrl}/assign/delete/${assignId}`, { headers })
      .map(resp => {
        return resp.json();
      });
  }

  deleteUser(userId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .delete(`${baseUrl}/auth/delete/${userId}`, { headers })
      .map(resp => {
        return resp.json();
      });
  }  

  setNotification(userId, assignId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    let body ={
      userId: userId,
      assignId: assignId
    };

    return this.http
          .post(`${baseUrl}/notifications/add`, body, { headers })
          .toPromise()
          .then(resp => resp.json())
          .catch(err => {
            console.log(err);
            return [];
          })
  }

  getNotifications(userId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/notifications/user/${userId}`, { headers })
      .toPromise()
      .then(resp => resp.json())
      .catch(err => {
        console.log(err);
        return [];
      })
  }

  deleteNotification(notificationId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .delete(`${baseUrl}/notifications/delete/${notificationId}`, { headers })
      .toPromise()
      .then(resp => resp.json())
      .catch(err => {
        console.log(err);
        return [];
      })
  }

  sendReport(report){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
          .post(`${baseUrl}/reports/send`, report, { headers })
          .toPromise()
          .then(resp => resp.json())
          .catch(err => {
            console.log(err);
            return [];
          })
  }

  getAllReports(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
          .get(`${baseUrl}/reports/1/all`, { headers })
          .map(resp => {
            return resp.json();
          });
  }

  deleteReport(reportId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
          .delete(`${baseUrl}/reports/delete/${reportId}`, { headers })
          .map(resp => {
            return resp.json();
          });
  }

  getAssignById(assignId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
      .get(`${baseUrl}/assign/profile/${assignId}`, { headers })
      .toPromise()
      .then(resp => resp.json())
      .catch(err => {
        console.log(err);
        return [];
      })
    }

  getAllActivities(){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
          .get(`${baseUrl}/assign/1/activities`, { headers })
          .map(resp => {
            return resp.json();
          });
  }

  getActivitiesById(userId){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
          .get(`${baseUrl}/assign/1/activities/${userId}`, { headers })
          .toPromise()
          .then(resp => resp.json())
          .catch(err => {
            console.log(err);
            return [];
          });
  }

  adminSearch(searchParam){
    let authToken = this.userService.getToken();
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', authToken);

    return this.http
    .post(`${baseUrl}/stats/search`, searchParam, { headers })
    .map(resp => {
      return resp.json();
    });
  }
}

