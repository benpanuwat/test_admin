import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { Payment } from '../model/payment';

declare const $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  payments: Payment[];

  paymentsDetail: any = { orders: {}, orders_agent: {} };

  total: any = { price_total: 0, logi_total: 0, grand_total: 0 };

  addValidation: boolean = false;
  massAdd: string = "";

  constructor(private http: HttpClient, private appserver: AppService) {

  }

  loadDataMember() {

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
          .post<DataTablesResponse>(this.appserver.server + '/payment/get_payment_table.php', dataTablesParameters, { headers: this.headers })
          .subscribe(resp => {
            this.payments = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "pay_id" },
        { data: "pay_createdate" },
        { data: "mem_fname" },
        { data: "mem_lname" },
        { data: "mem_tel" },
        { data: "pay_amount" },
        { data: "pay_status" },
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

    this.loadDataMember();

  }

  clickShowAcceptPayment(payment) {

    payment.mem_id = localStorage.getItem('id_admin');
    payment.userlogin = {
      id: localStorage.getItem('id_admin'),
      name: localStorage.getItem('name_admin'),
      email: localStorage.getItem('email_admin')
    };

    this.http.post<any>(this.appserver.server + '/payment/get_payment_detail.php', payment, { headers: this.headers }).subscribe(data => {
      if (data.success) {
        this.paymentsDetail = data.data.payment;

        this.total = {
          price_total: 0,
          logi_total: 0,
          grand_total: 0
        };
        
        var that = this;

        this.paymentsDetail.orders.forEach(function (ord) {
          ord.select = true;
          ord.total = (ord.ord_price * ord.ord_count) + parseInt(ord.logistic.logi_price);

          that.total.price_total += parseInt(ord.ord_price);
          that.total.logi_total += parseInt(ord.logistic.logi_price);
          that.total.grand_total += parseInt(ord.total);
        });

        this.paymentsDetail.orders_agent.forEach(function (orda) {
          orda.select = true;
          orda.total = (orda.orda_price * orda.orda_count) + parseInt(orda.logistic.logi_price);

          that.total.price_total += parseInt(orda.orda_price);
          that.total.logi_total += parseInt(orda.logistic.logi_price);
          that.total.grand_total += parseInt(orda.total);
        });
      }
    });

    $('#payment_accept').modal('show');
  }


  clickAcceptPayment(paymentsDetail) {

    paymentsDetail.mem_id = localStorage.getItem('id_admin');
    paymentsDetail.userlogin = {
      id: localStorage.getItem('id_admin'),
      name: localStorage.getItem('name_admin'),
      email: localStorage.getItem('email_admin')
    };

    this.http.post<any>(this.appserver.server + '/payment/accept_payment.php', paymentsDetail, { headers: this.headers }).subscribe(data => {
      if (data.success) {
        this.rerender();
        $('#payment_accept').modal('hide');
      }
    });

  }

  clickRejectPayment(paymentsDetail) {

    paymentsDetail.mem_id = localStorage.getItem('id_admin');
    paymentsDetail.userlogin = {
      id: localStorage.getItem('id_admin'),
      name: localStorage.getItem('name_admin'),
      email: localStorage.getItem('email_admin')
    };

    this.http.post<any>(this.appserver.server + '/payment/reject_payment.php', paymentsDetail, { headers: this.headers }).subscribe(data => {
      if (data.success) {
        this.rerender();
        $('#payment_accept').modal('hide');
      }
    });
  }
}