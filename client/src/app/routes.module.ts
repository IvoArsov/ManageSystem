import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/users/login/login.component';
import { RegisterComponent } from './components/users/register/register.component';
import { UserProfileComponent } from './components/users/profile/user-profile.component';
import { AddFirmComponent } from './components/firms/add/add-firm.component';
import { EditFirmComponent } from './components/firms/edit/edit-firm.component';
import { CreateAssignComponent } from './components/assign/create/create-assign.component';
import { EditAssignComponent } from './components/assign/edit/edit-assign.component';
import { ImportExportComponent } from './components/firms/importExport/import-export.component';
import { AdminPanelComponent } from './components/users/adminPanel/adminPanel.component';
import { ProfileFirmComponent } from './components/firms/profile/profile-firm.component';
import { CreateFirmAssignComponent } from './components/assign/create-firm/create-firm-assign.component';
import { ReportComponent } from './components/assign/report/report.component';
import { AssignProfileComponent } from './components/assign/assign-profile/assign-profile.component'; 
 
import { UserService } from './data/user.service';
import { EventService } from './data/event.service';
import { LoggedInGuard } from './directives/logged.in.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, /*canActivate: [LoggedInGuard]*/ },
  { path: 'new-firm', component: AddFirmComponent, canActivate: [LoggedInGuard] },
  { path: 'firm/edit/:id', component: EditFirmComponent, canActivate: [LoggedInGuard] },
  { path: 'firm/mine', component: UserProfileComponent, canActivate: [LoggedInGuard] },
  { path: 'assign/create/:id', component: CreateAssignComponent, canActivate: [LoggedInGuard] },
  { path: 'assign/edit/:id', component: EditAssignComponent, canActivate: [LoggedInGuard] },
  { path: 'import-export', component: ImportExportComponent, canActivate: [LoggedInGuard] },
  { path: 'admin-panel', component: AdminPanelComponent, canActivate: [LoggedInGuard] },
  { path: 'firm/profile/:id', component: ProfileFirmComponent, canActivate: [LoggedInGuard] },
  { path: 'firm/assign/:id', component: CreateFirmAssignComponent, canActivate: [LoggedInGuard] },
  { path: 'report/create/:id', component: ReportComponent, canActivate: [LoggedInGuard] },
  { path: 'assign/profile/:id', component: AssignProfileComponent, canActivate: [LoggedInGuard] }
];

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AddFirmComponent,
    EditFirmComponent,
    CreateAssignComponent,
    EditAssignComponent,
    ImportExportComponent,
    AdminPanelComponent,
    ProfileFirmComponent,
    CreateFirmAssignComponent,
    ReportComponent,
    AssignProfileComponent
  ],
  imports:[
    RouterModule.forRoot(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  providers: [UserService, LoggedInGuard, EventService]
})
export class AppRoutesModule {}