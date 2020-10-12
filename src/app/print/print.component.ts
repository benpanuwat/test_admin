import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  public headers: HttpHeaders;

  public user: any =
    {
      search: {
        sho_name: "",
        pro_name: "",
        prot_name: "",
        ord_id: "",
        orda_id: "",
        status: ""
      }
    };

  public orders: any = {}
  public orders_agent: any = {}

  constructor(private http: HttpClient, private appserver: AppService) { };

  ngOnInit() {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('Authorization', localStorage.getItem('token_admin'));

    this.user.mem_id = localStorage.getItem('id_admin');
    this.user.userlogin = {
      id: localStorage.getItem('id_admin'),
      name: localStorage.getItem('name_admin'),
      email: localStorage.getItem('email_admin')
    };
  }

  clickSearch() {
    this.http.post<any>(this.appserver.server + '/order/search_order_label.php', this.user, { headers: this.headers }).subscribe(data => {
      if (data.success) {
        this.orders = data.data.orders;
        this.orders_agent = data.data.orders_agent;
      }
    });
  }

  clickPrintOrder(ord) {
    this.user.search.ord_id = ord.ord_id;
    this.user.search.status = "ord";
    window.open("/dropy_admin/print_label?l=" + this.utf8_to_b64(JSON.stringify(this.user.search)), '_blank');
    ord.ord_print = '1';
  }

  clickPrintOrdera(orda) {
    this.user.search.orda_id = orda.orda_id;
    this.user.search.status = "orda";
    window.open("/dropy_admin/print_label?l=" + this.utf8_to_b64(JSON.stringify(this.user.search)), '_blank');
    orda.orda_print = '1';
  }

  clickPrintAll() {

    this.user.search.status = "all";
    window.open("/dropy_admin/print_label?l=" + this.utf8_to_b64(JSON.stringify(this.user.search)), '_blank');

    this.orders.forEach(function (ord) {
      ord.ord_print = '1';
    });

    this.orders_agent.forEach(function (orda) {
      orda.orda_print = '1';
    });
  }

  utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }

}
