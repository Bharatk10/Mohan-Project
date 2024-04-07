import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  implements OnInit{

  loggedInUser: any;
  id: string = '';
  user: any;

  constructor(private router: Router, private service: AuthService, private http: HttpClient) { }

  ngOnInit(): void {
    
    this.id = this.service.getuserName() ?? ''; 

    this.service.getuserbyId(this.id).subscribe((user: any) => {
      this.user = user;
      this.loggedInUser = user.name;
    });

    console.log(this.loggedInUser);
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }


}
