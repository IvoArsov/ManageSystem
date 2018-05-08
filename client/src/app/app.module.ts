import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutesModule } from './routes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule }from '@angular/http';
import { DatePipe } from '@angular/common';
//import { PopupModule } from 'ng2-opd-popup';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import  { Data }  from './data/data.service'; 
import { UserService }  from './data/user.service'; 

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { SearchComponent } from './components/home/search/search.component';
import { UserProfileComponent } from './components/users/profile/user-profile.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent, 
    HomeComponent,
    SearchComponent,
    UserProfileComponent,
    //FileSelectDirective     
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutesModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule.forRoot(),  
    BrowserAnimationsModule,
    //PopupModule.forRoot()
  ],
  providers: [Data, UserService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
