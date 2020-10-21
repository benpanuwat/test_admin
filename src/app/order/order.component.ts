import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { Order } from '../model/order';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  orders: Order[];

  constructor(private http: HttpClient, private appserver: AppService) { }

  loadDataOrder() {

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
          .post<DataTablesResponse>(this.appserver.server + '/order/get_order_table.php', dataTablesParameters, { headers: this.headers })
          .subscribe(resp => {
            this.orders = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "ord_id" },
        { data: "ord_createdate" },
        { data: "pro_name" },
        { data: "prot_name" },
        { data: "ord_price" },
        { data: "ord_count" },
        { data: "ord_logi_price" },
        { data: "ord_status" },
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

    this.loadDataOrder();
  }

  clickCancelOrder(ord) {
    if (confirm("ต้องการรายการสั่งซื้อนี้หรือไม่")) {

      ord.mem_id = localStorage.getItem('id_admin');
      ord.userlogin = {
          id: localStorage.getItem('id_admin'),
          name: localStorage.getItem('name_admin'),
          email: localStorage.getItem('email_admin')
        };

      this.http.post<any>(this.appserver.server + '/order/cancel_order.php', ord, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
        }
      });
    }
  }

}
