import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DataTablesModule } from "angular-datatables";
import { NgSlimScrollModule, SLIMSCROLL_DEFAULTS } from 'ngx-slimscroll';
import { MyDatePickerModule } from 'mydatepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FullCalendarModule } from 'ng-fullcalendar';
import { MorrisJsModule } from 'angular-morris-js';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { enableProdMode } from '@angular/core';
import { NumberDirective } from './numbers-only.directive';
import { NgxBarcodeModule } from 'ngx-barcode';
import { AuthGuard } from './auth/AuthGuard';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
// import { MemberComponent } from './member/member.component';
// import { PaymentComponent } from './payment/payment.component';
// import { BlogComponent } from './blog/blog.component';
// import { SettingComponent } from './setting/setting.component';
// import { OrderComponent } from './order/order.component';
// import { OrderAgentComponent } from './order-agent/order-agent.component';
// import { PrintComponent } from './print/print.component';
// import { PrintLabelComponent } from './print-label/print-label.component';
// import { PrintLabelThaipostComponent } from './print-label-thaipost/print-label-thaipost.component';
// import { WithdrawComponent } from './withdraw/withdraw.component';

enableProdMode();

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  // { path: 'member', component: MemberComponent, canActivate: [AuthGuard] },
  // { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
  // { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  // { path: 'orderagent', component: OrderAgentComponent, canActivate: [AuthGuard] },
  // { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  // { path: 'withdraw', component: WithdrawComponent, canActivate: [AuthGuard] },
  // { path: 'print', component: PrintComponent, canActivate: [AuthGuard] },
  // { path: 'print_label', component: PrintLabelComponent, canActivate: [AuthGuard] },
  // { path: 'print_label_thaipost', component: PrintLabelThaipostComponent, canActivate: [AuthGuard] },
  // { path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
  // { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SidebarComponent,
    HeaderComponent,
    //MemberComponent,
    UserComponent,
    NumberDirective,
    // PaymentComponent,
    // BlogComponent,
    // SettingComponent,
    // OrderComponent,
    // PrintComponent,
    // OrderAgentComponent,
    // PrintLabelComponent,
    // PrintLabelThaipostComponent,
    // WithdrawComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChartsModule,
    DataTablesModule,
    NgSlimScrollModule,
    MyDatePickerModule,
    NgxDatatableModule,
    FullCalendarModule,
    MorrisJsModule,
    NgxBarcodeModule,
    TooltipModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
