import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';


declare const $: any;
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  public loading = false;
  public headers: HttpHeaders;

  public setting: any = {
    banner : []
  };

  massStatus: boolean = false;
  mass: string = "";

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit(): void {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token_admin'));
    this.loadSetting();
  }

  loadSetting() {
    this.loading = true;
    this.http.post<any>(this.service.url + '/api/get_banner_back', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.setting.banner = res.data;

        let that = this;
        this.setting.banner.forEach(function (value) {
          value.path = that.service.url + '/' + value.path;
          value.image = "";
        });

        this.loading = false;
      }
    });

  }

  uploadImage() {
    $("#uploadImage").click();
  }

  loadImage(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.setting.banner.push({ id: '', path: '', image: event.target.result });
      }
    }
  };

  clickDeleteBanner(ban) {
    const index = this.setting.banner.indexOf(ban);
    this.setting.banner.splice(index, 1);
  }

  clickSave()
  {
    this.http.post<any>(this.service.url + '/api/update_banner_back', this.setting, { headers: this.headers }).subscribe(data => {
      if (data.code == 200) {
      }
    });
  }

  showMassageAlert(mass) {
    this.massStatus = true;
    this.mass = mass;

    setTimeout(function () {
      this.massStatus = false;
      this.mass = "";
    }, 3000);
  }
}
