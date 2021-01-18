import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginPageComponent implements OnInit {

  public userlogin = {
    username: "",
    password: ""
  };

  loginValidation: boolean = false;
  loginMass: string = "";

  constructor(private http: HttpClient, private service: AppService, private router: Router) { }

  ngOnInit() {
  }

  clickLogin(f) {
    if (f.invalid === true) {
      this.loginValidation = true;
      this.loginMass = "กรุณากรอกชื่อเข้าใช้งานและรหัสผ่านให้ถูกต้อง";
    }
    else {
      this.http.post<any>(this.service.url + '/api/user_login_back', this.userlogin, {}).subscribe(res => {
        if (res.code == 200) {

          localStorage.setItem("auth_admin", "true");
          localStorage.setItem("id_admin", res.data.id);
          localStorage.setItem("username_admin", res.data.username);
          localStorage.setItem("token_admin", res.data.token);
          window.location.href = "user";
        }
        else {
          this.loginValidation = true;
          this.loginMass = "ชื่อเข้าใช้งานหรือรหัสผ่านไม่ถูกต้อง";
        }
      });
    }
  }
}
