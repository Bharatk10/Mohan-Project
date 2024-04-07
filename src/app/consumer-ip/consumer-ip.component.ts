import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consumer-ip',
  templateUrl: './consumer-ip.component.html',
  styleUrls: ['./consumer-ip.component.css']
})
export class ConsumerIpComponent implements OnInit {

  consumerIpApps: any[] = [];
  selectedApp: any = { id: '',consumer_ip:'', consumer_name: '' };
  isNewFormVisible: boolean = false;
  isUpdateFormVisible: boolean = false;
  newAppName: string = '';
  newIpId: string='';
  updatedAppName: string = '';

  constructor(private http: HttpClient, private service: AuthService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.service.fetchConsumerIp().subscribe(
      data => {
        this. consumerIpApps = data;
      }
    );

  }
  onAppNameChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    this.selectedApp = this.consumerIpApps.find(app => app.consumer_name.toLowerCase() === searchText) || { id: null, app_name: '' ,consumer_ip:''};
  
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
    if (!this.newIpId) {
      this.toastr.warning('Please enter an IP.');
      return;
    }
    this.service.checkConsumerIpAppNameExists(this.newAppName).subscribe(
      exists => {
        if (exists) {
          this.toastr.warning('App name exists in JSON server data.');
        } else {
          console.log(this.newIpId)
          const existingAppId = this.consumerIpApps.find(app => app.consumer_ip == this.newIpId);
          
          if (existingAppId) {
            this.toastr.warning('Consumer IP is not unique.');
            return;
          }
          this.service.addConsumerIp({ consumer_ip: this.newIpId, consumer_name: this.newAppName }).subscribe(
            response => {
              this.isNewFormVisible = false;
              this.toastr.success('Consumer Ip added successfully');
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
    this.newIpId = '';
  }

  showUpdateForm() {
    this.updatedAppName = this.selectedApp.consumer_name;
    this.isUpdateFormVisible = true;
  }

  updateApp() {
    this.service.checkConsumerIpAppNameExists(this.updatedAppName).subscribe(
    
      exists => {
        console.log(this.updatedAppName)
        if (exists) {
          this.toastr.warning('Consumer IP name exists in JSON server data.');
        } 
        else{
          this.service.updateConsumerIp({ id: this.selectedApp.id, consumer_name: this.updatedAppName,consumer_ip:this.selectedApp.consumer_ip }).subscribe(
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
