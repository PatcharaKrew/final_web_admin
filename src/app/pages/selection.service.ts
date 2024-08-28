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
    setSelectedData(data: any[]): void {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getSelectedData(): any[] {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }

    clearSelectedData(): void {
      localStorage.removeItem(this.storageKey);
    }
  }
