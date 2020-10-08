import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  public headers: HttpHeaders;
  public settings: any = [];
  constructor(private http: HttpClient, private appserver: AppService) {

  }

  ngOnInit(): void {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));
    this.loadSetting();
  }

  loadSetting() {

    this.http.post<any>(this.appserver.server + '/setting/get_setting.php', {}, { headers: this.headers }).subscribe(res => {
      if (res.success) {
        this.settings = res.data.settings;
      }
    });

  }

}
