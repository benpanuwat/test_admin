import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { User } from '../model/user';

declare const $: any;

@Component({
  selector: 'app-member',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  users: User[];

  public user: any = {
    username: "",
    password: "",
    password_confirm: "",
    fname: "",
    lname: "",
    email: "",
    tel: "",
    permission: {
      user: true,
      member: true,
      category: true,
      product: true,
      order: true,
      payment: true,
      packing: true,
      delivery: true,
      cancel: true,
      stock: true,
      blog: true,
      new: true,
      setting: true,
    }
  };

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
            this.service.url + '/api/table_user_back',
            dataTablesParameters, { headers: this.headers }
          ).subscribe(resp => {
            this.users = resp.data;
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
        { data: "fname" },
        { data: "lname" },
        { data: "email" },
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  clickShowAddUser() {
    this.user = {
      username: "",
      password: "",
      password_confirm: "",
      fname: "",
      lname: "",
      email: "",
      tel: "",
      permission: {
        user: true,
        member: true,
        category: true,
        product: true,
        order: true,
        payment: true,
        packing: true,
        delivery: true,
        cancel: true,
        stock: true,
        blog: true,
        new: true,
        setting: true,
      }
    };
    $('#add_user').modal('show');
  }

  clickAddUser(f) {

    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.user.password.length < 8 || this.user.password_confirm.length < 8) {
      this.showMassageAlert("กรุณากำหนดรหัสผ่านมากกว่า 8 ตัวอักษร");
    }
    else if (this.user.password != this.user.password_confirm) {
      this.showMassageAlert("รหัสผ่านและยืนยันระหัสผ่านไม่ตรงกัน");
    }
    else {

      this.http.post<any>(this.service.url + '/api/create_user_back', this.user, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#add_user').modal('hide');
        }
        else if (data.code == 401) {
          localStorage.clear();
          window.location.href = "login";
        }
        else {
          this.showMassageAlert(data.massage);
        }
      });
    }
  }

  clickShowUpdateUser(user) {
    this.http.post<any>(this.service.url + '/api/get_user_detail_back', user, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.user = res.data;
      }
    });

    $('#update_user').modal('show');
  }

  clickUpdateUser(f) {
    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
    else {

      this.http.post<any>(this.service.url + '/api/update_user_back', this.user, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#update_user').modal('hide');
        }
        else if (data.code == 401) {
          localStorage.clear();
          window.location.href = "login";
        }
        else {
          this.showMassageAlert(data.massage);
        }
      });
    }
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