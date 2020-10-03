import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  public settings: any = [];
  constructor(private http: HttpClient, private appserver: AppService) {

  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {

    this.http.post<any>(this.appserver.server + '/setting/get_setting.php', {}, {}).subscribe(res => {
      if (res.success) {
        this.settings = res.data.products;
      }
    });

  }

}
