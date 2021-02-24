import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { Stock } from '../model/stock';


declare const $: any;

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  stocks: Stock[];

  public stock: any = {
    id: '',
    product_type: [
      {
        id: '',
        stock: 0
      }
    ]
  }

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
            this.service.url + '/api/table_stock_back',
            dataTablesParameters, { headers: this.headers }
          ).subscribe(resp => {
            this.stocks = resp.data;

            let that = this;

            this.stocks.forEach(function (value) {
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
        { data: "name" },
        { data: "product_type", orderable: false }
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }


  clickShowAddProduct(stock) {
    this.stock = {
      id: '',
      product_type: [
        {
          id: '',
          stock: 0
        }
      ]
    }

    this.http.post<any>(this.service.url + '/api/get_stock_detail', stock, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.loading = false;
        $('#add_stock').modal('show');
      }
    });
  }

  clickAddStock(f) {

    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else {

      this.http.post<any>(this.service.url + '/api/create_product_back', this.stock, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
          $('#add_product').modal('hide');
        }
      });
    }
  }

  // clickShowUpdateProduct(product) {
  //   this.loading = true;
  //   this.http.post<any>(this.service.url + '/api/get_product_detail_back', product, { headers: this.headers }).subscribe(res => {
  //     if (res.code == 200) {
  //       this.product = res.data.product;
  //       this.category = res.data.category;

  //       let that = this;
  //       this.product.product_image.forEach(function (value) {
  //         value.path = that.service.url + '/' + value.path;
  //         value.image = '';
  //       });

  //       this.loading = false;
  //       $('#update_product').modal('show');
  //     }
  //   });
  // }

  // clickUpdateProduct(f) {
  //   if (f.invalid === true) {
  //     this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
  //   }
  //   else if (this.product.product_image.length == 0) {
  //     this.showMassageAlert("กรุณากำหนดรูปภาพสินค้า");
  //   }
  //   else {
  //     this.http.post<any>(this.service.url + '/api/update_product_back', this.product, { headers: this.headers }).subscribe(data => {
  //       if (data.status) {
  //         this.rerender();
  //         $('#update_product').modal('hide');
  //       }
  //     });
  //   }
  // }






  showMassageAlert(mass) {
    this.massStatus = true;
    this.mass = mass;

    setTimeout(function () {
      this.massStatus = false;
      this.mass = "";
    }, 3000);
  }
}