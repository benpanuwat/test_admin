import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-print-label-thaipost',
  templateUrl: './print-label-thaipost.component.html',
  styleUrls: ['./print-label-thaipost.component.css']
})
export class PrintLabelThaipostComponent implements OnInit {

  public headers: HttpHeaders;
  public order: any = {
    ord_id: "",
    orda_id: "",
    search: {}
  };

  public orders: any = [];
  public orders_agent: any = [];

  public index = 0;

  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient, private appserver: AppService) {
    this.activatedRoute.queryParams.subscribe(params => {
      const l = params['l'];

      if (l != undefined)
        this.order.search = JSON.parse(this.b64_to_utf8(l));

      //console.log(this.order.search);
    });
  }

  ngOnInit(): void {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token_admin'));


    this.order.mem_id = localStorage.getItem('id_admin');
    this.order.userlogin = {
      id: localStorage.getItem('id_admin'),
      name: localStorage.getItem('name_admin'),
      email: localStorage.getItem('email_admin')
    };


    this.http.post<any>(this.appserver.server + '/order/get_all_order_label.php', this.order, { headers: this.headers }).subscribe(res => {
      if (res.success) {
        this.orders = res.data.orders;
        this.orders_agent = res.data.orders_agent;

        //console.log(this.orders);
        //console.log(this.orders_agent);

        setTimeout(function () {
          document.title = "Dropy Label";
          //window.print();
        }, 1000);
      }
    });

  }

  b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
  }
}
