import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-services',
  templateUrl: './data-services.component.html',
  styleUrls: ['./data-services.component.css']
})
export class DataServicesComponent implements OnInit {

  dataServiceApps: any[] = [];
  selectedApp: any = { id: '',service_url:'', consumer_name: '' };
  isNewFormVisible: boolean = false;
  isUpdateFormVisible: boolean = false;
  newAppName: string = '';
  newServiceUrl: string='';
  updatedAppName: string = '';

  constructor(private http: HttpClient, private service: AuthService,private toastr: ToastrService,private router :Router) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.service.fetchDataService().subscribe(
      data => {
        this.dataServiceApps = data;
      }
    );

  }
  onAppNameChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    this.selectedApp = this.dataServiceApps.find(app => app.consumer_name.toLowerCase() === searchText) || { id: null, app_name: '' ,service_url:''};
    console.log(this.selectedApp)
  }

  isAddButtonDisabled(): boolean {
    return this.selectedApp.consumer_name !== '';
  }

  isUpdateButtonDisabled(): boolean {
    return this.selectedApp.consumer_ip === null;
  }

  showNewForm() {
    this.isNewFormVisible = true;
    this.newAppName = this.selectedApp.consumer_name;
  }


  addNewApp() {
    if (!this.newServiceUrl) {
      this.toastr.warning('Please enter an Service Url.');
      return;
    }
    this.service.checkDataServiceNameExists(this.newAppName).subscribe(
      exists => {
        if (exists) {
          this.toastr.warning('App name exists in JSON server data.');
        } else {
          console.log(this.newServiceUrl)
          const existingAppId = this.dataServiceApps.find(app => app.service_url === this.newServiceUrl);
          
          if (existingAppId) {
            this.toastr.warning('Service Url is not unique.');
            return;
          }
          this.service.addDataService({ consumer_ip: this.newServiceUrl, consumer_name: this.newAppName }).subscribe(
            response => {
              this.isNewFormVisible = false;
              this.toastr.success('Data Service App added successfully');
              this.fetchData();
              setTimeout(() => {
                window.location.reload(); 
            }, 2000);
            },
            error => {
              this.toastr.error('Failed to add the app.');
            }
          );
        }
      },
      error => {
        this.toastr.error('Failed to check app name existence.');
      }
    );
  }
  
  cancelNewApp() {
    this.isNewFormVisible = false;
    this.newAppName = '';
    this.newServiceUrl = '';
  }

  showUpdateForm() {
    this.updatedAppName = this.selectedApp.consumer_name;
    this.isUpdateFormVisible = true;
  }

  updateApp() {
    this.service.checkDataServiceNameExists(this.updatedAppName).subscribe(
    
      exists => {
        console.log(this.updatedAppName)
        if (exists) {
          this.toastr.warning('App name exists in JSON server data.');
        } 
        else{
          this.service.updateDataService({ id: this.selectedApp.id, consumer_name: this.updatedAppName,service_url:this.selectedApp.service_url }).subscribe(
            response => {
              this.toastr.success('App updated successfully');
              this.fetchData();
              this.isUpdateFormVisible = false;
              
              setTimeout(() => {
                window.location.reload(); 
            }, 2000);
              
            },
            error => {
              this.toastr.error('Failed to update the app.');
            }
          );

        }
      });
  }

  isUpdateFormInvalid(): boolean {
    return !this.updatedAppName || this.updatedAppName.trim() === '';
  }

  cancelUpdate() {
    this.isUpdateFormVisible = false;
    this.updatedAppName = '';
  }

}