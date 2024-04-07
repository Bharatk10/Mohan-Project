import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-itgrc',
  templateUrl: './itgrc.component.html',
  styleUrls: ['./itgrc.component.css']
})
export class ItgrcComponent implements OnInit {

  grcApps: any[] = [];
  selectedApp: any = { id: '', app_name: '' };
  isNewFormVisible: boolean = false;
  isUpdateFormVisible: boolean = false;
  newAppName: string = '';
  newAppId: string='';
  updatedAppName: string = '';

  constructor(private http: HttpClient, private service: AuthService,private toastr: ToastrService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.service.fetchGrcApps().subscribe(
      data => {
        this.grcApps = data;
      }
    );
    console.log(this.grcApps)
  }

  onAppNameChange(event: any) {
    const searchText = event.target.value.toLowerCase();
    this.selectedApp = this.grcApps.find(app => app.app_name.toLowerCase() === searchText) || { id: null, app_name: '' };
  }

  isAddButtonDisabled(): boolean {
    return this.selectedApp.app_name !== '';
  }

  isUpdateButtonDisabled(): boolean {
    return this.selectedApp.id === null;
  }

  showNewForm() {
    this.isNewFormVisible = true;
    this.newAppName = this.selectedApp.app_name;
  }


  addNewApp() {
    if (!this.newAppId) {
        this.toastr.warning('Please enter an ID.');
        return;
    }

    this.service.checkAppNameExists(this.newAppName).subscribe(
      exists => {
          console.log("App exists:", exists); // Log existence check result
          if (exists) {
              this.toastr.warning('App name exists in JSON server data.');
          }
          else {

              const existingAppId = this.grcApps.find(app => app.id == this.newAppId);
              if (existingAppId) {
                  this.toastr.warning('App ID is not unique.');
                  return;
              }
              this.service.addGrcApps({ id: this.newAppId, app_name: this.newAppName }).subscribe(
                  response => {
                      this.isNewFormVisible = false;
                      this.toastr.success('ItGrc App added successfully');
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
    this.newAppId = '';
  }

  showUpdateForm() {
    this.updatedAppName = this.selectedApp.app_name;
    this.isUpdateFormVisible = true;
  }

  updateApp() {
    this.service.checkAppNameExists(this.updatedAppName).subscribe(
    
      exists => {
        if (exists) {
          this.toastr.warning('App name exists in JSON server data.');
        } 
        else{
          this.service.updateGrcApp({ id: this.selectedApp.id, app_name: this.updatedAppName }).subscribe(
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
