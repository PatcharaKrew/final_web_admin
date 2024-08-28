import { Component, OnInit } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectionService } from '../selection.service';
import { ModalComponent } from '../modal/modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgZorroModule, CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  selectedData: any[] = [];

  constructor(private selectionService: SelectionService, private modal: NzModalService) {}

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
  viewData(data: any): void {
    const modal = this.modal.create({
      nzTitle: 'ข้อมูลทั้งหมด',
      nzContent: ModalComponent,
      nzFooter: null
    });

    const instance = modal.getContentComponent();
    instance.data = { id: data.id };

    modal.afterClose.subscribe(() => {
      console.log('Modal closed');
    });
  }

}
