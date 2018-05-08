import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RequestOptions } from '@angular/http';

import { ExcelData } from '../../../models/excelData.model';
import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';
import { UserService } from '../../../data/user.service';

@Component({
    selector: 'import-export',
    templateUrl: './import-export.component.html',
    styleUrls: ['./import-export.component.css']
})
export class ImportExportComponent {
    excelTable;
    fileList: FileList;
    file: File;
    userId: number;
    headers;

    constructor(
        private dataBase: Data,
        private eventService: EventService,
        private userService: UserService
    ){
        this.excelTable = new ExcelData();
    }      

    fileChange(event) {
        this.fileList = event.target.files;
        if(this.fileList.length > 0) {
            console.log(this.fileList);
            this.file = this.fileList[0];
            console.log(this.file);
            let formData:FormData = new FormData();
            formData.append('uploadFile', this.file, this.file.name);
            
            //let options = new RequestOptions({headers: headers});
            //this.http.post(`${this.apiEndPoint}`, formData, options)
            //    .map(res => res.json())
            //    .catch(error => Observable.throw(error))
            //    .subscribe(
            //        data => console.log('success'),
            //        error => console.log(error)
            //    )

        }        
    }

    onSubmit(){
        this.userId = this.userService.getUser().userId;
        this.file['userId'] = this.userId;
        let formData:FormData = new FormData();
        formData.append('uploadFile', this.file, this.file.name);
        this.headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
        this.headers.append('Content-Type', 'multipart/form-data');
        this.headers.append('Accept', 'application/json');
        let options = {
            headers: {
              'Content-Type':'multipart/form-data',
              'Accept':'application/json'
            }
          }
        this.dataBase.addFirmViaXlsx(formData, this.headers)
    }
}