import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { Blog } from '../model/blog';

declare const $: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  blogs: Blog[];


  public use_id = "";
  public permission = {
    use_customer_create: "0",
    use_customer_edit: "0",
    use_customer_delete: "0",
    use_action: "0"
  };


  public addM: any = {};
  public uptM: any = {};

  addValidation: boolean = false;
  massAdd: string = "";
  editValidation: boolean = false;
  massEdit: string = "";

  constructor(private http: HttpClient, private appserver: AppService) {

  }

  loadDataBlog() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      pageLength: 10,
      autoWidth: false,
      language: {
        processing: "ประมวลผล...",
        search: "ค้นหา",
        lengthMenu: "แสดง _MENU_ รายการ",
        info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
        infoEmpty: "ไม่พบข้อมูลที่ค้นหา",
        infoFiltered: "(ค้นหาจากทั้นหมด _MAX_ รายการ)",
        infoPostFix: "",
        loadingRecords: "ประมวลผล...",
        paginate: {
          first: "หน้าแรก",
          previous: "หน้าก่อนหน้า",
          next: "หน้าถัดไป",
          last: "หน้าสุดท้าย"
        }
      },
      ajax: (dataTablesParameters: any, callback) => {

        dataTablesParameters.mem_id = localStorage.getItem('id');
        dataTablesParameters.userlogin = {
          id: localStorage.getItem('id'),
          name: localStorage.getItem('name'),
          email: localStorage.getItem('email')
        };

        this.http
          .post<DataTablesResponse>(this.appserver.server + '/blogs/get_blog_datatable.php', dataTablesParameters, { headers: this.headers })
          .subscribe(resp => {
            this.blogs = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "blog_id" },
        { data: "blog_name" },
        { data: "tags" },
        { data: "cat_name" },
        { data: "created_at" },
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }


  ngOnInit() {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token'));

    this.loadDataBlog();

  }

  clickShowAddMember() {
    this.addM = {
      mem_email: "",
      mem_password: "",
      mem_password_confirm: "",
      mem_fname: "",
      mem_lname: "",
      mem_tel: "",
      mem_sex: "",
      mem_birthday: "",
      mem_newsletter: false
    };
    $('#add_member').modal('show');
  }

  clickAddMember(f) {

    if (f.invalid === true) {
      this.addValidation = true;
      this.massAdd = "กรุณากรอกข้อมูลให้ครับถ้วน";
    }
    else if (this.addM.mem_password.length < 8 || this.addM.mem_password_confirm.length < 8) {
      this.addValidation = true;
      this.massAdd = "กรุณากำหนดรหัสผ่านมากกว่า 8 ตัวอักษร";
    }
    else if (this.addM.mem_password != this.addM.mem_password_confirm) {
      this.addValidation = true;
      this.massAdd = "รหัสผ่านและยืนยันระหัสผ่านไม่ตรงกัน";
    }
    else {
      this.addValidation = false;

      this.addM.mem_id = localStorage.getItem('id');
      this.addM.userlogin = {
        id: localStorage.getItem('id'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email')
      };

      this.http.post<any>(this.appserver.server + '/member/create_member.php', this.addM, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
        }
      });

      $('#add_member').modal('hide');
    }
  }

  clickShowEditMember(member) {
    this.uptM = member;
    this.uptM.mem_password = "";
    this.uptM.mem_password_confirm = "";
    this.uptM.mem_changepass = false;
    
    this.uptM.mem_id = localStorage.getItem('id');
    this.uptM.userlogin = {
      id: localStorage.getItem('id'),
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email')
    };

    $('#edit_member').modal('show');
  }

  clickEditMember(f) {
    if (f.invalid === true) {
      this.editValidation = true;

      this.massEdit = "กรุณากรอกข้อมูลให้ครบถ้วน";
    }
    else {

      if (this.uptM.mem_changepass) {
        if (this.uptM.mem_password.length < 8 || this.uptM.mem_password_confirm.length < 8) {
          this.editValidation = true;
          this.massEdit = "กรุณากำหนดรหัสผ่านมากกว่า 8 ตัวอักษร";
        }
        else if (this.uptM.mem_password != this.uptM.mem_password_confirm) {
          this.editValidation = true;
          this.massEdit = "รหัสผ่านและยืนยันระหัสผ่านไม่ตรงกัน";
        }
        else {
          this.editValidation = false;

          this.http.post<any>(this.appserver.server + '/member/edit_member.php', this.uptM, { headers: this.headers }).subscribe(data => {
            if (data.status) {
              this.rerender();
            }
          });

          $('#edit_member').modal('hide');
        }
      }
      else {
        this.http.post<any>(this.appserver.server + '/member/edit_member.php', this.uptM, { headers: this.headers }).subscribe(data => {
          if (data.status) {
            this.rerender();
          }
        });

        $('#edit_member').modal('hide');
      }
    }
  }

  clickDeleteCustomer(customer) {
    if (confirm("ต้องการลบลูกค้านี้หรือไม่")) {
      customer.cus_useby = this.use_id;
      this.http.post<any>(this.appserver.server + '/customer/delete_customer.php', customer, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
        }
      });
    }
  }
}
