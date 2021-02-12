import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { Order } from '../model/order';


declare const $: any;
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  orders: Order[];

  public order: any = {
    member:{
      fname:''
    },
    address:{
      name:''
    }
  };

  constructor(private http: HttpClient, private service: AppService) {
  }


  ngOnInit() {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token_admin'));

    this.loadDataOrder();
  }

  loadDataOrder() {
    this.loading = true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      pageLength: 10,
      autoWidth: false,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {

        this.http
          .post<DataTablesResponse>(this.service.url + '/api/table_order_back', dataTablesParameters, { headers: this.headers })
          .subscribe(resp => {
            this.orders = resp.data;
            this.loading = false;

            callback({
              recordsTotal: resp.total,
              recordsFiltered: resp.total,
              data: [],
            });
          });
      },
      columns: [
        { data: "code" },
        { data: "fname" },
        { data: "lname" },
        { data: "price_total" },
        { data: "created_at" },
        { data: "status" }
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }

  clickShowDetailOrder(order) {
    this.http.post<any>(this.service.url + '/api/get_order_detail_back', order, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.order = res.data;

        let that = this;
        this.order.order_product.forEach(function (value) {
          value.path = that.service.url + '/' + value.path;
        });
      }
    });

    $('#order_detail').modal('show');
  }

  clickCancelOrder(ord) {
    if (confirm("ต้องการรายการสั่งซื้อนี้หรือไม่")) {

      // ord.mem_id = localStorage.getItem('id_admin');
      // ord.userlogin = {
      //     id: localStorage.getItem('id_admin'),
      //     name: localStorage.getItem('name_admin'),
      //     email: localStorage.getItem('email_admin')
      //   };

      // this.http.post<any>(this.appserver.server + '/order/cancel_order.php', ord, { headers: this.headers }).subscribe(data => {
      //   if (data.status) {
      //     this.rerender();
      //   }
      // });
    }
  }

}
