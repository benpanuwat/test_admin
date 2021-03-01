import { Component, OnInit, AfterContentInit } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

declare const $: any;
declare const Morris: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public headers: HttpHeaders;

  public data = {
    count: {
      user: 0,
      member: 0,
      product: 0,
      order: 0
    },
    chart1: [],
    chart2: []
  }

  public myDatePickerOptions: IMyDpOptions = {
    todayBtnTxt: 'Today',
    dateFormat: 'yyyy-mm-dd',
    firstDayOfWeek: 'mo',
    sunHighlight: true,
    inline: false
  };

  public projects = [];
  public clients = [];
  public invoices = [];
  public payments = [];

  // Initialized to specific date (09.10.2018).
  public model: any = { date: { year: 2018, month: 10, day: 9 } };
  public dash: any = { 'projects': 112, 'clients': 44, 'tasks': 37, 'employees': 218 };

  constructor(private http: HttpClient, private service: AppService, private router: Router) {
    //this.projects = appService.projects;
    //this.clients = appService.clients;
    //this.invoices = appService.invoices;
    //this.payments = appService.payments;
  }

  ngAfterContentInit() {

  }

  ngOnInit() {

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token_admin'));

    var pro_heights = $(".panel-eqHeight-clients").map(function () {
      return $(this).height();
    }).get(),
      pro_maxHeight = Math.max.apply(null, pro_heights);
    $(".panel-eqHeight-projects").height(pro_maxHeight);
    $(".panel-eqHeight-clients").height(pro_maxHeight);

    var pay_heights = $(".panel-eqHeight-invoices").map(function () {
      return $(this).height();
    }).get(),
      pay_maxHeight = Math.max.apply(null, pay_heights);
    $(".panel-eqHeight-payments").height(pay_maxHeight);
    $(".panel-eqHeight-invoices").height(pay_maxHeight);

    this.http.post<any>(this.service.url + '/api/get_dashboard_back', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.data = res.data;

        Morris.Bar({
          element: 'bar-charts',
          data: this.data.chart1,
          xkey: 'month_text',
          ykeys: ['member_count', 'order_count'],
          labels: ['ลูกค้าใหม่', 'คำสั่งซื้อใหม่'],
          lineColors: ['#ff9b44', '#fc6075'],
          lineWidth: '3px',
          barColors: ['#ff9b44', '#fc6075'],
          resize: true,
          redraw: true
        });

        Morris.Donut({
          element: 'pie-charts',
          data: this.data.chart2,
          resize: true,
          redraw: true
        });

      }
      else if (res.code == 401) {
        localStorage.clear();
        window.location.href = "login";
      }
    });

  }



}
