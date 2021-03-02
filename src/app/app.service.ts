import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  public url = "https://www.truelinemed.com/api/public";
  //public url = "http://127.0.0.1:8000";

  public dbLanguage = {
    processing: "ประมวลผล...",
    search: "ค้นหา",
    lengthMenu: "แสดง _MENU_ รายการ",
    info: "แสดง _START_ ถึง _END_ จาก _TOTAL_ รายการ",
    infoEmpty: "ไม่พบข้อมูลที่ค้นหา",
    infoFiltered: "(ค้นหาจากทั้นหมด _MAX_ รายการ)",
    infoPostFix: "",
    loadingRecords: "ประมวลผล...",
    paginate: {
      first: "หน้าแรก",
      previous: "หน้าก่อนหน้า",
      next: "หน้าถัดไป",
      last: "หน้าสุดท้าย"
    }
  }

  constructor() { }

}
