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
import { BrowserAnimationsModule, } from '@angular/platform-browser/animations';
import { enableProdMode } from '@angular/core';
import { NumberDirective } from './numbers-only.directive';
import { NgxBarcodeModule } from 'ngx-barcode';
import { MatDialogModule } from '@angular/material/dialog';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AuthGuard } from './auth/AuthGuard';
import { NgxLoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { UserComponent } from './user/user.component';
import { MemberComponent } from './member/member.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderComponent } from './order/order.component';
import { PackingComponent } from './packing/packing.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { CancelComponent } from './cancel/cancel.component';
import { BlogComponent } from './blog/blog.component';
import { NewComponent } from './new/new.component';
import { SettingComponent } from './setting/setting.component';

enableProdMode();

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'member', component: MemberComponent, canActivate: [AuthGuard] },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard] },
  { path: 'packing', component: PackingComponent, canActivate: [AuthGuard] },
  { path: 'delivery', component: DeliveryComponent, canActivate: [AuthGuard] },
  { path: 'cancel', component: CancelComponent, canActivate: [AuthGuard] },
  { path: 'blog', component: BlogComponent, canActivate: [AuthGuard] },
  { path: 'new', component: NewComponent, canActivate: [AuthGuard] },
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SidebarComponent,
    HeaderComponent,
    MemberComponent,
    UserComponent,
    NumberDirective,
    CategoryComponent,
    ProductComponent,
    PaymentComponent,
    OrderComponent,
    PackingComponent,
    DeliveryComponent,
    CancelComponent,
    BlogComponent,
    NewComponent,
    SettingComponent,
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
    MatDialogModule,
    ImageCropperModule,
    NgxLoadingModule,
    TooltipModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
