import { Component, OnInit } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgZorroModule, CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  selectedData: any[] = [];

  constructor(private selectionService: SelectionService) {}

  ngOnInit(): void {
    this.loadData();
  }
  loadData(): void {
    const savedData = this.selectionService.getSelectedData(); // ดึงข้อมูลจาก SelectionService
    if (savedData && savedData.length > 0) {
      this.selectedData = savedData;
    } else {
      const localStorageData = localStorage.getItem('selectedData');
      if (localStorageData && JSON.parse(localStorageData).length > 0) {
        this.selectedData = JSON.parse(localStorageData);
      } else {
        // หากไม่มีข้อมูล ให้ลองโหลดใหม่จาก localStorage หรือแจ้งเตือนให้กด F5
        this.selectedData = [];
      }
    }
    console.log('Data in history:', this.selectedData);
  }

  deleteRow(index: number): void {
    this.selectedData.splice(index, 1);  // ลบข้อมูลออกจาก array
    localStorage.setItem('selectedData', JSON.stringify(this.selectedData));  // อัปเดต Local Storage
    this.selectionService.setSelectedData(this.selectedData);  // อัปเดตใน SelectionService
  }
}
