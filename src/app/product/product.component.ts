import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { Product } from '../model/product';


declare const $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  products: Product[];

  public product: any = {
    id: '',
    name: '',
    description: '',
    detail: '',
    standard_price: '',
    category_id: 1,
    price: '',
    product_image: [],
    product_type: [
      {
        name: '',
        price: 0,
        stock: 0
      }
    ]
  }

  public category: any = [];

  massStatus: boolean = false;
  mass: string = "";

  public addStatus = "add";

  public originalImage: any = '';
  public croppedImage: any = '';

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
            this.service.url + '/api/table_product_back',
            dataTablesParameters, { headers: this.headers }
          ).subscribe(resp => {
            this.products = resp.data;

            let that = this;

            this.products.forEach(function (value) {
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
        { data: "category_name" },
        { data: "active" }
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }


  clickShowAddProduct() {
    this.product = {
      id: '',
      name: '',
      description: '',
      detail: '',
      standard_price: '',
      category_id: 1,
      price: '',
      product_image: [],
      product_type: [
        {
          name: '',
          price: 0,
          stock: 0
        }
      ]
    }

    this.http.post<any>(this.service.url + '/api/get_category_back', {}, { headers: this.headers }).subscribe(res => {
      if (res.status) {
        this.category = res.data;
      }
    });

    $('#add_product').modal('show');
  }

  uploadImage() {
    $("#uploadImage").click();
  }

  cropImage(event) {
    this.originalImage = event;
    this.addStatus = "crop";
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  cropSave() {
    this.compressImage(this.croppedImage, 800, 800).then(compressed => {

      if (this.product.product_image.length == 0)
        this.product.product_image.push({ id: '', image: compressed, main: true });
      else
        this.product.product_image.push({ id: '', image: compressed, main: false });

      this.addStatus = "add";
    })
  }

  clickMain(image) {
    this.product.product_image.forEach(function (value) {
      value.main = false;
    });

    image.main = true;
  }

  clickDeleteImage(image) {
    const index = this.product.product_image.indexOf(image);

    if (this.product.product_image[index].main == true)
      if (this.product.product_image.length > 0)
        this.product.product_image[0].main = true;

    this.product.product_image.splice(index, 1);
  }


  addType() {
    this.product.product_type.push({ id: '', name: '', price: 0, stock: 0 });
  }

  clickDeleteType(type) {
    const index = this.product.product_type.indexOf(type);
    if (index > 0) {
      this.product.product_type.splice(index, 1);
    }
  }

  // addPriceList() {
  //   this.product.price_list.push({ count: 1, price: 0 });
  // }

  // clickDeletePrice(price) {
  //   const index = this.product.price_list.indexOf(price);
  //   if (index > 0) {
  //     this.product.price_list.splice(index, 1);
  //   }
  // }

  // changePrice() {
  //   this.product.price_list[0].price = this.product.price;
  // }

  clickAddProduct(f) {

    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.product.product_image.length == 0) {
      this.showMassageAlert("กรุณากำหนดรูปภาพสินค้า");
    }
    else {

      this.http.post<any>(this.service.url + '/api/create_product_back', this.product, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
          $('#add_product').modal('hide');
        }
      });
    }
  }

  clickShowUpdateProduct(product) {
    this.loading = true;
    this.http.post<any>(this.service.url + '/api/get_product_detail_back', product, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.product = res.data.product;
        this.category = res.data.category;

        let that = this;
        this.product.product_image.forEach(function (value) {
          value.path = that.service.url + '/' + value.path;
          value.image = '';
        });

        this.loading = false;
        $('#update_product').modal('show');
      }
    });
  }

  clickUpdateProduct(f) {
    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.product.product_image.length == 0) {
      this.showMassageAlert("กรุณากำหนดรูปภาพสินค้า");
    }
    else {
      this.http.post<any>(this.service.url + '/api/update_product_back', this.product, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
          $('#update_product').modal('hide');
        }
      });
    }
  }

  clickProductActive(product) {
      this.http.post<any>(this.service.url + '/api/update_product_active_back', product, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
        }
      });
  }

  clickProductNoActive(product) {
    this.http.post<any>(this.service.url + '/api/update_product_noactive_back', product, { headers: this.headers }).subscribe(data => {
      if (data.code == 200) {
        this.rerender();
      }
    });
}

  compressImage(src, newX, newY) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL('image/jpeg', 0.5);
        res(data);
      }
      img.onerror = error => rej(error);
    })
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