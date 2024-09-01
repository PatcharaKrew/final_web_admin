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
    const savedData = this.selectionService.getSelectedData() || []; // ข้อมูลที่ถูกเลือกจากหน้า not check
    const today = new Date();

    this.appointmentService.getAppointments().subscribe(
      (data) => {
        // กรองข้อมูลที่เลยวันนัดหมายจาก API
        const pastAppointments = data.filter(appointment => new Date(appointment.appointment_date) < today);

        // ตรวจสอบข้อมูลที่เลือกจากหน้า not check และข้อมูลใน localStorage เพียงครั้งเดียว
        const combinedData = [...new Set([...pastAppointments, ...savedData])];

        // กำหนดค่า selectedData และ filteredData
        this.selectedData = combinedData;
        this.filteredData = combinedData;

        // เคลียร์ข้อมูลใน SelectionService และ Local Storage หลังจากใช้ข้อมูลแล้ว
        this.selectionService.clearSelectedData();
        localStorage.removeItem('selectedData');
      },
      (error) => {
        console.error('Error loading appointments:', error);
      }
    );
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
  deleteRow(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      this.filteredData = this.filteredData.filter(item => item.id !== id);
      this.selectedData = this.selectedData.filter(item => item.id !== id);
    }, error => {
      console.error('Error deleting appointment:', error);
    });
  }
}
