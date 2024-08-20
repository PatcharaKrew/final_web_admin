import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private storageKey = 'selectedData'; // กำหนด key สำหรับ Local Storage

  // เพิ่มข้อมูลลงใน selectedData และบันทึกลงใน Local Storage
  addSelectedData(data: any): void {
    const currentData = this.getSelectedData(); // ดึงข้อมูลปัจจุบันจาก Local Storage
    currentData.push(data); // เพิ่มข้อมูลใหม่ลงไป
    this.setSelectedData(currentData); // อัปเดต Local Storage
  }

  // ดึงข้อมูล selectedData จาก Local Storage
  getSelectedData(): any[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : []; // หากไม่มีข้อมูลให้คืนค่ากลับเป็น array ว่างๆ
  }

  // ล้างข้อมูล selectedData และลบข้อมูลใน Local Storage
  clearSelectedData(): void {
    localStorage.removeItem(this.storageKey); // ลบข้อมูลใน Local Storage
  }

  // กำหนดข้อมูล selectedData และบันทึกลงใน Local Storage
  setSelectedData(data: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
}
