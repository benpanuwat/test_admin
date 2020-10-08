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
    use_username: "",
    use_password: ""
  };

  loginValidation: boolean = false;
  loginMass: string = "";

  constructor(private http: HttpClient, private appserver: AppService,private router: Router) { }

  ngOnInit() {
  }

  clickLogin(f) {
    if (f.invalid === true) {
      this.loginValidation = true;
      this.loginMass = "กรุณากรอกชื่อเข้าใช้งานและรหัสผ่านให้ถูกต้อง";
    }
    else {
      this.http.post<any>(this.appserver.server + '/login/login_admin.php', this.userlogin, {}).subscribe(res => {
        if (res.success) {

          localStorage.setItem("auth", res.success);
          localStorage.setItem("id_admin", res.data.user.id);
          localStorage.setItem("name", res.data.user.name);
          localStorage.setItem("email", res.data.user.email);
          localStorage.setItem("token", res.data.token);
          this.router.navigate(['/member']);
        }
        else {
          this.loginValidation = true;
          this.loginMass = "ชื่อเข้าใช้งานหรือรหัสผ่านไม่ถูกต้อง";
        }
      });
    }
  }
}
