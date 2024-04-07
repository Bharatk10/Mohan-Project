import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
 
  constructor(private builder: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router) {
  }

  result: any;

  loginform = this.builder.group({
    id: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  });

  proceedlogin() {
    if (this.loginform.valid) {
      this.service.getuserbyId(this.loginform.value.id).subscribe(
        (item: any) => {
          this.result = item;
          if (this.result && this.result.password === this.loginform.value.password) {
            sessionStorage.setItem('username', this.result.id);
            this.router.navigate(['home']);
          } else {
            this.toastr.error('Incorrect login details');
          }
        },
        (error: any) => {
          console.error(error);
          this.toastr.error('Inncorect User Name');
        }
      );
    } else {
      this.toastr.warning('Please enter valid data.');
    }
  }

}
