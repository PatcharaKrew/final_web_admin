import { Component, OnInit } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../appointment.service';
import { Router } from '@angular/router';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-not-check',
  standalone: true,
  imports: [NgZorroModule, CommonModule, FormsModule],
  templateUrl: './not-check.component.html',
  styleUrl: './not-check.component.scss'
})
export class NotCheckComponent implements OnInit {

  listOfData: any[] = [];
  filteredData: any[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly any[] = [];
  selectedProgram = '';
  programs: string[] = [];

  constructor(
    private modal: NzModalService,
    private appointmentService: AppointmentService,
    private router: Router,
    private selectionService: SelectionService,

  ) { }

  ngOnInit(): void {
    this.loadAppointments();  // ดึงข้อมูลเมื่อคอมโพเนนท์ถูกสร้าง
    this.restoreCheckedState();  // เรียกคืนสถานะการเลือกจาก Local Storage
  }

  loadAppointments(): void {
    const today = new Date();

    this.appointmentService.getAppointments().subscribe(
      (data) => {
        // แบ่งข้อมูลระหว่างนัดหมายที่ยังไม่ถึงวันและนัดหมายที่เลยวันแล้ว
        const upcomingAppointments = data.filter(appointment => new Date(appointment.appointment_date) >= today);
        const pastAppointments = data.filter(appointment => new Date(appointment.appointment_date) < today);

        // ตั้งค่า listOfData และ filteredData สำหรับนัดหมายที่ยังไม่ถึงวัน
        this.listOfData = upcomingAppointments;
        this.filteredData = upcomingAppointments;
        this.programs = [...new Set(upcomingAppointments.map(item => item.program_name))];

        // ส่งข้อมูลนัดหมายที่เลยวันแล้วไปยัง history
        if (pastAppointments.length > 0) {
          this.selectionService.setSelectedData(pastAppointments);
          localStorage.setItem('selectedData', JSON.stringify(pastAppointments));
          this.router.navigate(['/history']);
        }
      },
      (error) => {
        console.error('Error loading appointments:', error);
      }
    );
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
    this.saveCheckedState(); // บันทึกสถานะการเช็ค
    const shouldMoveToHistory = this.setOfCheckedId.size > 0;

    if (shouldMoveToHistory) {
      this.selectionService.setShouldShowHistoryData(true); // อัพเดท Boolean ใน SelectionService
      this.moveToHistory(shouldMoveToHistory);
    } else {
      this.selectionService.setShouldShowHistoryData(false); // ซ่อนข้อมูลถ้าไม่มีการเลือก
      this.stayInNotCheck(shouldMoveToHistory);
    }
  }


  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateChecked(id, checked);
    this.refreshCheckedStatus();
    this.saveCheckedState();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) => this.updateChecked(id, checked));
    this.refreshCheckedStatus();
    this.saveCheckedState();

    // ตรวจสอบสถานะ Boolean
    const shouldMoveToHistory = checked; // หากเช็คทั้งหมด หมายถึง Boolean เป็น true

    if (shouldMoveToHistory) {
      this.moveToHistory(shouldMoveToHistory);  // ส่ง Boolean เป็น true
    } else {
      this.stayInNotCheck(shouldMoveToHistory);  // ส่ง Boolean เป็น falseด
    }
  }

  updateChecked(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  filterData(): void {
    if (this.selectedProgram) {
      this.filteredData = this.listOfData.filter(item => item.program_name === this.selectedProgram);
    } else {
      this.filteredData = this.listOfData;
    }
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
      this.listOfData = this.listOfData.filter(item => item.id !== id);
      this.saveCheckedState();  // อัปเดตการลบใน Local Storage
    }, error => {
      console.error('Error deleting appointment:', error);
    });
  }

  // เรียกฟังก์ชัน moveToHistory เมื่อข้อมูลที่เลือกเลยวันนัดหมาย
  moveToHistory(shouldMove: boolean): void {
    const selectedData = this.listOfData.filter(item => this.setOfCheckedId.has(item.id));

    if (selectedData.length > 0 && shouldMove) {
      this.selectionService.setSelectedData(selectedData);
      localStorage.setItem('selectedData', JSON.stringify(selectedData));

      this.router.navigate(['/history']).then(() => {
        console.log('Navigated to /history');
      }).catch(err => {
        console.error('Navigation error:', err);
      });
    }
}



  saveCheckedState(): void {
    const checkedArray = Array.from(this.setOfCheckedId);
    localStorage.setItem('checkedItems', JSON.stringify(checkedArray));
  }

  restoreCheckedState(): void {
    const savedCheckedItems = localStorage.getItem('checkedItems');
    if (savedCheckedItems) {
        const checkedArray = JSON.parse(savedCheckedItems);
        this.setOfCheckedId = new Set<number>(checkedArray);
        this.refreshCheckedStatus(); // อัปเดตสถานะการเช็ค
    }
    // ไม่จำเป็นต้องเรียกใช้ onCurrentPageDataChange ที่นี่
}

  stayInNotCheck(shouldMove: boolean): void {
    if (!shouldMove) {
      console.log('Stay in not check');

      // เคลียร์ข้อมูลใน SelectionService และ Local Storage
      this.selectionService.clearSelectedData();
      localStorage.removeItem('selectedData');
    }
  }

}
