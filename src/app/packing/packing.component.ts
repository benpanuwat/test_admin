import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { Order } from '../model/order';

declare const $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.css']
})
export class PackingComponent implements OnInit {
  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  orders: Order[];

  public order: any = {
    member: {
      fname: ''
    },
    address: {
      name: ''
    }
  };

  massStatus: boolean = false;
  mass: string = "";


  constructor(private http: HttpClient, private service: AppService) {

  }


  ngOnInit() {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token_admin'));

    this.loadDataPayment();

  }

  loadDataPayment() {
    this.loading = true;
    this.dtOptions = {
      pagingType: 'full_numbers',
      serverSide: true,
      pageLength: 10,
      autoWidth: false,
      order: [[0, 'desc']],
      ajax: (dataTablesParameters: any, callback) => {

        this.http
          .post<DataTablesResponse>(this.service.url + '/api/table_packing_back', dataTablesParameters, { headers: this.headers })
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

  clickShowCheckPacking(order) {

    this.http.post<any>(this.service.url + '/api/get_packing_detail_back', order, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.order = res.data;
        let that = this;
        this.order.order_product.forEach(function (value) {
          value.path = that.service.url + '/' + value.path;
        });
      }
    });

    $('#check_packing').modal('show');
  }


  clickPacking(order) {
    this.http.post<any>(this.service.url + '/api/update_packing_back', order, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.rerender();
        $('#check_packing').modal('hide');
      }
      else if (res.code == 401) {
        localStorage.clear();
        window.location.href = "login";
      }
      else
        this.showMassageAlert(res.massage);

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