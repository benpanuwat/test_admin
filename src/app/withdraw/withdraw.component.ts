import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { Withdraw } from '../model/withdraw';

declare const $: any;

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  withdraw: Withdraw[];

  withdrawDetail: any = {};

  constructor(private http: HttpClient, private appserver: AppService) {

  }


  loadDataWithdraw() {

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

        dataTablesParameters.mem_id = localStorage.getItem('id_admin');
        dataTablesParameters.userlogin = {
          id: localStorage.getItem('id_admin'),
          name: localStorage.getItem('name_admin'),
          email: localStorage.getItem('email_admin')
        };

        this.http
          .post<DataTablesResponse>(this.appserver.server + '/withdraw/get_withdraw_table.php', dataTablesParameters, { headers: this.headers })
          .subscribe(resp => {
            this.withdraw = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "wit_id" },
        { data: "wit_createdate" },
        { data: "mem_fname" },
        { data: "mem_lname" },
        { data: "wit_amount" },
        { data: "wit_status" }
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
    this.headers = this.headers.append('Authorization', localStorage.getItem('token_admin'));

    this.loadDataWithdraw();
  }

  clickShowAcceptWithdraw(wit) {

    wit.mem_id = localStorage.getItem('id_admin');
    wit.userlogin = {
      id: localStorage.getItem('id_admin'),
      name: localStorage.getItem('name_admin'),
      email: localStorage.getItem('email_admin')
    };

    this.http.post<any>(this.appserver.server + '/withdraw/get_withdraw_detail.php', wit, { headers: this.headers }).subscribe(data => {
      if (data.success) {
        this.withdrawDetail = data.data.withdraw;
      }
    });

    $('#withdraw_accept').modal('show');
  }

  clickAcceptWithdraw() {

    var data = {
      withdraw: this.withdrawDetail,
      mem_id: localStorage.getItem('id_admin'),
      userlogin: {
        id: localStorage.getItem('id_admin'),
        name: localStorage.getItem('name_admin'),
        email: localStorage.getItem('email_admin')
      }
    }

    this.http.post<any>(this.appserver.server + '/withdraw/accept_withdraw.php', data, { headers: this.headers }).subscribe(data => {
      if (data.success) {
        this.rerender();
        $('#withdraw_accept').modal('hide');
      }
    });
  }

  clickRejectWithdraw() {

    var data = {
      withdraw: this.withdrawDetail,
      mem_id: localStorage.getItem('id_admin'),
      userlogin: {
        id: localStorage.getItem('id_admin'),
        name: localStorage.getItem('name_admin'),
        email: localStorage.getItem('email_admin')
      }
    }

    this.http.post<any>(this.appserver.server + '/withdraw/reject_withdraw.php', data, { headers: this.headers }).subscribe(data => {
      if (data.success) {
        this.rerender();
        $('#withdraw_accept').modal('hide');
      }
    });
  }
}
