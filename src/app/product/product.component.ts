import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { Product } from '../model/product';

declare const $: any;

@Component({
  selector: 'app-member',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  products: Product[];

  public product = new Product();
  public addMassStatus: boolean = false;
  public addMass: string = "";

  constructor(private http: HttpClient, private service: AppService) {

  }

  ngOnInit() {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', "Bearer " + localStorage.getItem('token'));

    this.loadDataUser();

  }

  loadDataUser() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      autoWidth: false,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.http
          .post<DataTablesResponse>(
            this.service.url + '/api/table_product_back',
            dataTablesParameters, { headers: this.headers }
          ).subscribe(resp => {
            this.products = resp.data;

            callback({
              recordsTotal: resp.total,
              recordsFiltered: resp.total,
              data: []
            });
          });
      },
      columns: [
        { data: "pro_id" },
        { data: "pro_name" }
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }


  clickShowAddProduct() {
    this.product = new Product();
    $('#add_product').modal('show');
  }

  clickAddProduct(f) {
    if (f.invalid === true) {
      this.addMassStatus = true;
      this.addMass = "กรุณากรอกข้อมูลให้ครับถ้วน";
    }
    else {

    }
  }
}