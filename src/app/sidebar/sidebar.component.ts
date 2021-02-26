import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router'
import { ISlimScrollOptions } from 'ngx-slimscroll';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public headers: HttpHeaders;

  opts: ISlimScrollOptions;
  public url;
  url2;
  homeView: boolean = true;
  chatView: boolean = false;
  mailView: boolean = false;
  messageView: boolean = false;
  composeView: boolean = false;
  settingsView: boolean = false;
  callView: boolean = false;
  taskView: boolean = false;

  public permission: any = {
    user: false,
    member: false,
    category: false,
    product: false,
    order: false,
    payment: false,
    packing: false,
    delivery: false,
    cancel: false,
    stock: false,
    blog: false,
    new: false,
    setting: false,
  }

  public alert: any = {
    order_payment: 5,
    order_packing: 4,
    order_delivery: 3
  }

  constructor(private location: Location, private router: Router, private activatedRoute: ActivatedRoute, private renderer: Renderer2, private http: HttpClient, private service: AppService) {

    router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        $(".modal").modal("hide");
        //console.log(event.url);
      }

      if (event instanceof NavigationEnd) {
        this.url = event.url.split('/')[1].split("?")[0];
        //console.log(event.url);
        //console.log(this.url);
        //console.log(this.url2);

        let height = $(window).height();
        $(".page-wrapper").css("min-height", height);

        $(".main-wrapper").removeClass('slide-nav-toggle');
        $('#chat_sidebar').removeClass('opened');
        $('.sidebar-overlay').removeClass('opened');
        $('.task-overlay').removeClass('opened');

      }

      if (event instanceof NavigationError) {
        //console.log(event.error);
      }
    });

  }

  ngOnInit() {
    this.opts = {
      barBackground: '#ccc',
      gridBackground: 'transparent',
      barOpacity: '0.4',
      barBorderRadius: '6',
      barWidth: '6',
      gridWidth: '0',
      alwaysVisible: false,
      //height:'100%'
    }

    var h = $(window).height() - 60;
    $('.slimscroll-wrapper').height(h);

    $(window).resize(function () {
      var h = $(window).height() - 60;
      $('.slimscroll-wrapper').height(h);
    });

    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', "Bearer " + localStorage.getItem('token_admin'));


    this.http.post<any>(this.service.url + '/api/get_user_permission_back', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.permission = res.data;
      }
    });

    this.http.post<any>(this.service.url + '/api/get_alert_back', {}, { headers: this.headers }).subscribe(res => {
      if (res.code == 200) {
        this.alert = res.data;
      }
    });


  }


}

