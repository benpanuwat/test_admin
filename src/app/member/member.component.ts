import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { Member } from '../model/member';

declare const $: any;

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  members: Member[];


  public use_id = "";
  public permission = {
    use_customer_create: "0",
    use_customer_edit: "0",
    use_customer_delete: "0",
    use_action: "0"
  };

  public member: any = {
    email: "",
    password: "",
    password_confirm: "",
    fname: "",
    lname: "",
    tel: ""
  };

  massStatus: boolean = false;
  mass: string = "";

  constructor(private http: HttpClient, private service: AppService) {

  }

  ngOnInit() {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token_admin'));

    this.loadDataMember();

  }

  loadDataMember() {

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
            this.service.url + '/api/table_member_back',
            dataTablesParameters, { headers: this.headers }
          ).subscribe(resp => {
            this.members = resp.data;
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
        { data: "email" },
        { data: "fname" },
        { data: "lname" },
        { data: "tel" },
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  clickShowAddMember() {
    this.member = {
      email: "",
      password: "",
      password_confirm: "",
      fname: "",
      lname: "",
      tel: ""
    };
    $('#add_member').modal('show');
  }

  clickAddMember(f) {

    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.member.password.length < 8 || this.member.password_confirm.length < 8) {
      this.showMassageAlert("กรุณากำหนดรหัสผ่านมากกว่า 8 ตัวอักษร");
    }
    else if (this.member.password != this.member.password_confirm) {
      this.showMassageAlert("รหัสผ่านและยืนยันระหัสผ่านไม่ตรงกัน");
    }
    else {
      this.http.post<any>(this.service.url + '/api/create_member_back', this.member, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#add_member').modal('hide');
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

  clickShowUpdateMember(member) {
    this.member = member;

    $('#update_member').modal('show');
  }

  clickUpdateMember(f) {
    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
    else {

      this.http.post<any>(this.service.url + '/api/update_memder_back', this.member, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#update_member').modal('hide');
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

  clickShowUpdatePassword(member) {
    this.member = member;
    $('#update_password').modal('show');
  }

  clickUpdatePassword(f) {

    if (this.member.password.length < 8 || this.member.password_confirm.length < 8) {
      this.showMassageAlert("กรุณากำหนดรหัสผ่านมากกว่า 8 ตัวอักษร");
    }
    else if (this.member.password != this.member.password_confirm) {
      this.showMassageAlert("รหัสผ่านและยืนยันระหัสผ่านไม่ตรงกัน");
    }
    else {
      this.http.post<any>(this.service.url + '/api/update_password_back', this.member, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#update_password').modal('hide');
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

  // clickDeleteCustomer(customer) {
  //   // if (confirm("ต้องการลบลูกค้านี้หรือไม่")) {
  //   //   customer.cus_useby = this.use_id;
  //   //   this.http.post<any>(this.appserver.server + '/customer/delete_customer.php', customer, { headers: this.headers }).subscribe(data => {
  //   //     if (data.status) {
  //   //       this.rerender();
  //   //     }
  //   //   });
  //   // }



  showMassageAlert(mass) {
    this.massStatus = true;
    this.mass = mass;

    setTimeout(function () {
      this.massStatus = false;
      this.mass = "";
    }, 3000);
  }
}
