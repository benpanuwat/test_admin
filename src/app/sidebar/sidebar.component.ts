import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router'
import { ISlimScrollOptions } from 'ngx-slimscroll';

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

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

  public permission = {
    use_user_view: "0",
    use_customer_view: "0",
    use_product_view: "0",
    use_order_view: "0",
    use_delivery_view: "0",
    use_stock_view: "0",
    use_report: "0",
    use_report_order: "0",
    use_report_product: "0",
    use_report_delivery: "0"
  };


  constructor(private location: Location, private router: Router, private activatedRoute: ActivatedRoute, private renderer: Renderer2) {

    router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        $(".modal").modal("hide");
        //console.log(event.url);
      }

      if (event instanceof NavigationEnd) {
        this.url = event.url.split('/')[1];
        this.url2 = event.url.split('/')[2];
        //console.log(event.url);
        //console.log(this.url);
        //console.log(this.url2);

        let height = $(window).height();
        $(".page-wrapper").css("min-height", height);

        $(".main-wrapper").removeClass('slide-nav-toggle');
        $('#chat_sidebar').removeClass('opened');
        $('.sidebar-overlay').removeClass('opened');
        $('.task-overlay').removeClass('opened');


        this.permission.use_user_view = localStorage.getItem('use_user_view');
        this.permission.use_customer_view = localStorage.getItem('use_customer_view');
        this.permission.use_product_view = localStorage.getItem('use_product_view');
        this.permission.use_order_view = localStorage.getItem('use_order_view');
        this.permission.use_delivery_view = localStorage.getItem('use_delivery_view');
        this.permission.use_stock_view = localStorage.getItem('use_stock_view');
        this.permission.use_report_order = localStorage.getItem('use_report_order');
        this.permission.use_report_product = localStorage.getItem('use_report_product');
        this.permission.use_report_delivery = localStorage.getItem('use_report_delivery');

        if(this.permission.use_report_order == '1' || this.permission.use_report_product == '1'|| this.permission.use_report_delivery == '1')
        {
          this.permission.use_report = '1';
        }
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


  }


}

