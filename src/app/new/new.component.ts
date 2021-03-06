import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';

import { News } from '../model/news';


declare const $: any;

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  news: News[];

  public n: any = {
    id: '',
    title: '',
    detail: '',
    path: '',
    image: '',
    news_images: []
  }

  public category: any = [];

  massStatus: boolean = false;
  mass: string = "";

  constructor(private http: HttpClient, private service: AppService) {
  }

  ngOnInit() {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', "Bearer " + localStorage.getItem('token_admin'));

    this.loadDataUser();

  }

  loadDataUser() {

    this.loading = true;

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            this.service.url + '/api/table_news_back',
            dataTablesParameters, { headers: this.headers }
          ).subscribe(resp => {
            this.news = resp.data;

            let that = this;
            this.news.forEach(function (value) {
              value.path = that.service.url + '/' + value.path;
            });

            this.loading = false;

            callback({
              recordsTotal: resp.total,
              recordsFiltered: resp.total,
              data: []
            });
          });
      },
      columns: [
        { data: "id" },
        { data: "path" },
        { data: "title" },
        { data: "created_at" },
        { data: "show" }
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  uploadImageNewMain() {
    $("#uploadImageNewMain").click();
  }

  loadImageNewMain(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.n.image = event.target.result;
      }
    }
  };


  clickShowAddNews() {
    this.n = {
      id: '',
      title: '',
      detail: '',
      path: '',
      image: '',
      news_images: []
    }

    $('#add_news').modal('show');
  }

  uploadImage() {
    $("#uploadImage").click();
  }

  loadImage(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.n.news_images.push({ id: '', path: '', image: event.target.result });
      }
    }
  };

  clickDeleteImage(image) {
    const index = this.n.news_images.indexOf(image);
    this.n.news_images.splice(index, 1);
  }

  clickAddNews(f) {

    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.n.news_images.length == 0 || this.n.image == '') {
      this.showMassageAlert("กรุณากำหนดรูปภาพข่าวสาร");
    }
    else {
      this.http.post<any>(this.service.url + '/api/create_news_back', this.n, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#add_news').modal('hide');
        }
      });
    }
  }

  clickShowUpdateNews(n) {
    this.loading = true;
    this.http.post<any>(this.service.url + '/api/get_news_detail_back', n, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.n = res.data.news;

        let that = this;
        this.n.path = that.service.url + '/' + this.n.path;
        this.n.image = "";

        this.n.news_images.forEach(function (value) {
          value.path = that.service.url + '/' + value.path;
          value.image = '';
        });

        this.loading = false;
        $('#update_news').modal('show');
      }
    });
  }

  clickUpdateNews(f) {
    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.n.news_images.length == 0) {
      this.showMassageAlert("กรุณากำหนดรูปภาพข่าวสาร");
    }
    else {
      this.http.post<any>(this.service.url + '/api/update_news_back', this.n, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#update_news').modal('hide');
        }
      });
    }
  }

  clickDeleteNews(n) {
    if (confirm("คุณต้องการลบข่าวสารนี้หรือไม่")) {
      this.http.post<any>(this.service.url + '/api/delete_news_back', n, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
        }
      });
    }
  }

  clickProductActive(product) {
    this.http.post<any>(this.service.url + '/api/update_news_show_back', product, { headers: this.headers }).subscribe(data => {
      if (data.code == 200) {
        this.rerender();
      }
    });
  }

  clickProductNoActive(product) {
    this.http.post<any>(this.service.url + '/api/update_news_noshow_back', product, { headers: this.headers }).subscribe(data => {
      if (data.code == 200) {
        this.rerender();
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