import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';
import { ImageCroppedEvent } from 'ngx-image-cropper';

import { Category } from '../model/category';


declare const $: any;

@Component({
  selector: 'app-member',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  categorys: Category[];

  public category: any = {
    id: '',
    name: '',
    path: '',
    image: ''

  }


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
            this.service.url + '/api/table_category_back',
            dataTablesParameters, { headers: this.headers }
          ).subscribe(resp => {
            this.categorys = resp.data;
            let that = this;
            this.categorys.forEach(function (value) {
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
        { data: "name" }
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }


  clickShowAddCategory() {
    this.category = {
      id: '',
      name: '',
      path: '',
      image: ''
    }

    $('#add_category').modal('show');
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
      this.category.image = compressed;
      this.addStatus = "add";
    })
  }

  clickAddCategory(f) {

    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.category.image == '') {
      this.showMassageAlert("กรุณากำหนดรูปภาพหมวดหมู่");
    }
    else {
      this.http.post<any>(this.service.url + '/api/create_category_back', this.category, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
          $('#add_category').modal('hide');
        }
      });
    }
  }

  clickShowUpdateCategory(category) {
    this.category = category;
    this.category.image = '';
    $('#update_category').modal('show');
  }

  clickUpdateCategory(f) {
    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.category.path == '' && this.category.image == '') {
      this.showMassageAlert("กรุณากำหนดรูปภาพหมวดหมู่");
    }
    else {
      this.http.post<any>(this.service.url + '/api/update_category_back', this.category, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
          $('#update_category').modal('hide');
        }
      });
    }
  }

  clickDeleteCategory(category) {
    if(confirm("คุณต้องการลบหมวดหมู่สิ้นค้านี้หรือไม่"))
    {
      this.http.post<any>(this.service.url + '/api/delete_category_back',category, { headers: this.headers }).subscribe(data => {
        if (data.status) {
          this.rerender();
        }
      });
    }
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