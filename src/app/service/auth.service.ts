import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap,map } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  userurl = 'http://localhost:3000/user';
  grcurl ='http://localhost:3000/grc_apps';
  consumerurl = 'http://localhost:3000/consumers';
  consumerIpurl = 'http://localhost:3000/consumerIp';
  dataServiceurl ='http://localhost:3000/data_services';

  getAll() {
    return this.http.get(this.userurl);
  }

  getbytecode(code: any) {
    return this.http.get(this.userurl + '/' + code);
  }

  getuserbyId(id: any) {
    return this.http.get(this.userurl + '/' + id);
  }

  isloggedin() {
    return sessionStorage.getItem('username') !== null;
  }

  getuserName(): string | null {
    return sessionStorage.getItem('username');
  }
  

  fetchGrcApps(): Observable<any[]> {
    return this.http.get<any[]>(this.grcurl);
  }

  addGrcApps(newApp: any): Observable<any> {

    if (typeof newApp.id === 'number') {
     
      newApp.id = newApp.id.toString();
    } 
    return this.http.post<any>(this.grcurl, newApp);
  }

  checkAppNameExists(appName: string): Observable<boolean> {
    return this.http.get<any[]>(this.grcurl).pipe(
        map(
            apps => {
                if (!apps || !Array.isArray(apps)) {
                    console.error("Invalid response received from server");
                    return false; 
                }
                console.log("Apps received from server:", apps); 
                return apps.some(app => app && app.app_name && app.app_name.toLowerCase() === appName.toLowerCase());
            }
        ),
        catchError(error => {
            console.error("Error checking app name existence:", error); 
            return of(false); 
        })
    );
}


  checkConsumerAppNameExists(appName: string): Observable<boolean> {
    return this.http.get<any[]>(this.consumerurl).pipe(
      map(apps => apps.some(app => app.consumer_name.toLowerCase() === appName.toLowerCase()))
    );
  }
  updateGrcApp(updatedApp: any): Observable<any> {
    const updateUrl = `${this.grcurl}/${updatedApp.id}`;
    return this.http.put<any>(updateUrl, updatedApp);
  }
  fetchConsumers(): Observable<any[]> {
    return this.http.get<any[]>(this.consumerurl);
  }
  addConsumer(newApp: any): Observable<any> {

    if (typeof newApp.id === 'number') {
     
      newApp.id = newApp.id.toString();
    } 
    return this.http.post<any>(this.consumerurl, newApp);
  }
  updateConsumer(updatedApp: any): Observable<any> {
    const updateUrl = `${this.consumerurl}/${updatedApp.id}`;
    return this.http.put<any>(updateUrl, updatedApp);
  }
  fetchConsumerIp(): Observable<any[]> {
    return this.http.get<any[]>(this.consumerIpurl);
  }
  addConsumerIp(newApp: any): Observable<any> {
    return this.generateUniqueId('consumerIp').pipe(
        switchMap(id => {
            newApp.id = id;
            return this.http.post<any>(this.consumerIpurl, newApp);
        })
    );
}

addDataService(newApp: any): Observable<any> {
    return this.generateUniqueId('dataService').pipe(
        switchMap(id => {
            newApp.id = id;
            return this.http.post<any>(this.dataServiceurl, newApp);
        })
    );
}

generateUniqueId(service: string): Observable<string> {
  const randomNumber = Math.floor(Math.random() * 1000000);
  return this.isIdUnique(randomNumber.toString(), service).pipe(
      switchMap(isUnique => {
          if (isUnique) {
              return of(randomNumber.toString()); 
          } else {
              return this.generateUniqueId(service); 
          }
      })
  );
}
isIdUnique(id: string, service: string): Observable<boolean> {
    if (service === 'consumerIp') {
        return this.http.get<any[]>(this.consumerIpurl).pipe(
            map(consumers => {
                const existingConsumer = consumers.find(consumer => consumer.id === id);
                return !existingConsumer;
            })
        );
    } else if (service === 'dataService') {
        return this.http.get<any[]>(this.dataServiceurl).pipe(
            map(dataservices => {
                const existingDataService = dataservices.find(dataservice => dataservice.id === id);
                return !existingDataService;
            })
        );
    } else {
        return of(false); 
    }
}
  checkConsumerIpAppNameExists(appName: string): Observable<boolean> {
   
    return this.http.get<any[]>(this.consumerIpurl).pipe(
      map(apps => apps.some(app => app.consumer_name.toLowerCase() === appName.toLowerCase()))
    );
  }
  updateConsumerIp(updatedApp: any): Observable<any> {
    const updateUrl = `${this.consumerIpurl}/${updatedApp.id}`;
    return this.http.put<any>(updateUrl, updatedApp);
  }
  fetchDataService(): Observable<any[]> {
    return this.http.get<any[]>(this.dataServiceurl);
  }
  checkDataServiceNameExists(appName: string): Observable<boolean> {
   
    return this.http.get<any[]>(this.dataServiceurl).pipe(
      map(apps => apps.some(app => app.consumer_name.toLowerCase() === appName.toLowerCase()))
    );
  }
  updateDataService(updatedApp: any): Observable<any> {
    const updateUrl = `${this.dataServiceurl}/${updatedApp.id}`;
    return this.http.put<any>(updateUrl, updatedApp);
  }

}
