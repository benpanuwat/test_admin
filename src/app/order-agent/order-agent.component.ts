import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { OrderAgent } from '../model/order-agent';

@Component({
  selector: 'app-order-agent',
  templateUrl: './order-agent.component.html',
  styleUrls: ['./order-agent.component.css']
})
export class OrderAgentComponent implements OnInit {

  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};

  order_agents: OrderAgent[];

  constructor(private http: HttpClient, private appserver: AppService) { }

  loadDataOrderAgent() {

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
          .post<DataTablesResponse>(this.appserver.server + '/order/get_order_agents_table.php', dataTablesParameters, { headers: this.headers })
          .subscribe(resp => {
            this.order_agents = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: "orda_id" },
        { data: "orda_createdate" },
        { data: "pro_name" },
        { data: "prot_name" },
        { data: "orda_price" },
        { data: "orda_count" },
        { data: "orda_logi_price" },
        { data: "orda_status" },
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

    this.loadDataOrderAgent();
  }

  clickCancelOrdera(orda) {
    if (confirm("ต้องการรายการสั่งซื้อนี้หรือไม่")) {

      orda.mem_id = localStorage.getItem('id_admin');
      orda.userlogin = {
          id: localStorage.getItem('id_admin'),
          name: localStorage.getItem('name_admin'),
          email: localStorage.getItem('email_admin')
        };

      this.http.post<any>(this.appserver.server + '/order/cancel_order_agent.php', orda, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
        }
      });
    }
  }
}
