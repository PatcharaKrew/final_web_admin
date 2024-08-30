import { Component, OnInit } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectionService } from '../selection.service';
import { ModalComponent } from '../modal/modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppointmentService } from '../../appointment.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgZorroModule, CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  selectedData: any[] = [];
  filteredData: any[] = [];
  appointmentDetails: any = null;
  searchText: string = ''; // ตัวแปรสำหรับเก็บค่าค้นหา

  constructor(
    private selectionService: SelectionService,
    private modal: NzModalService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const savedData = this.selectionService.getSelectedData();
    if (savedData && savedData.length > 0) {
      this.selectedData = savedData;
      this.filteredData = savedData; // กำหนดค่าเริ่มต้นให้ filteredData เท่ากับ selectedData
    } else {
      const localStorageData = localStorage.getItem('selectedData');
      if (localStorageData && JSON.parse(localStorageData).length > 0) {
        this.selectedData = JSON.parse(localStorageData);
        this.filteredData = this.selectedData;
      } else {
        this.selectedData = [];
        this.filteredData = [];
      }
    }
  }

  filterData(): void {
    const searchTerm = this.searchText.toLowerCase().trim();

    this.filteredData = this.selectedData.filter(item => {
      const fullName = `${item.first_name} ${item.last_name}`.toLowerCase();
      return (
        fullName.includes(searchTerm) ||
        item.id_card?.toLowerCase().includes(searchTerm) ||
        item.phone?.toLowerCase().includes(searchTerm) ||
        item.first_name?.toLowerCase().includes(searchTerm) ||
        item.last_name?.toLowerCase().includes(searchTerm)
      );
    });

    console.log('Filtered Data:', this.filteredData);
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
