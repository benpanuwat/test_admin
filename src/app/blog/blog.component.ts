import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';
import { DataTablesResponse } from '../model/datatables-response';
import { DataTableDirective } from 'angular-datatables';

import { Blog } from '../model/blog';


declare const $: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  public loading = false;
  public headers: HttpHeaders;

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  blogs: Blog[];

  public blog: any = {
    id: '',
    title: '',
    detail: '',
    blog_images: []
  }

  public category: any = [];

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
            this.service.url + '/api/table_blog_back',
            dataTablesParameters, { headers: this.headers }
          ).subscribe(resp => {
            this.blogs = resp.data;
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
        { data: "title" },
        { data: "created_at" },
        { data: "active" }
      ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }


  clickShowAddBlog() {
    this.blog = {
      id: '',
      title: '',
      detail: '',
      blog_images: []
    }

    // this.http.post<any>(this.service.url + '/api/get_category_back', {}, { headers: this.headers }).subscribe(res => {
    //   if (res.status) {
    //     this.category = res.data;
    //   }
    // });

    $('#add_blog').modal('show');
  }

  uploadImage() {
    $("#uploadImage").click();
  }

  loadImage(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.blog.blog_images.push({ id: '', path: '', image: event.target.result });
      }
    }
  };

  clickDeleteImage(image) {
    const index = this.blog.blog_images.indexOf(image);
    this.blog.blog_images.splice(index, 1);
  }

  clickAddBlog(f) {

    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.blog.blog_images.length == 0) {
      this.showMassageAlert("กรุณากำหนดรูปภาพบล็อก");
    }
    else {
      this.http.post<any>(this.service.url + '/api/create_blog_back', this.blog, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#add_blog').modal('hide');
        }
      });
    }
  }

  clickShowUpdateBlog(blog) {
    this.loading = true;
    this.http.post<any>(this.service.url + '/api/get_blog_detail_back', blog, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.blog = res.data.blog;
        //this.category = res.data.category;

        let that = this;
        this.blog.blog_images.forEach(function (value) {
          value.path = that.service.url + '/' + value.path;
          value.image = '';
        });

        this.loading = false;
        $('#update_blog').modal('show');
      }
    });
  }

  clickUpdateBlog(f) {
    if (f.invalid === true) {
      this.showMassageAlert("กรุณากรอกข้อมูลให้ครับถ้วน");
    }
    else if (this.blog.blog_images.length == 0) {
      this.showMassageAlert("กรุณากำหนดรูปภาพบล็อก");
    }
    else {
      this.http.post<any>(this.service.url + '/api/update_blog_back', this.blog, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
          $('#update_blog').modal('hide');
        }
      });
    }
  }

  clickDeleteBlog(blog) {
    if (confirm("คุณต้องการลบบล็อกนี้หรือไม่")) {
      this.http.post<any>(this.service.url + '/api/delete_blog_back', blog, { headers: this.headers }).subscribe(data => {
        if (data.code == 200) {
          this.rerender();
        }
      });
    }
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