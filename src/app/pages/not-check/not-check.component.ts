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

  ) {}

  ngOnInit(): void {
    this.loadAppointments();  // ดึงข้อมูลเมื่อคอมโพเนนท์ถูกสร้าง
    this.restoreCheckedState();  // เรียกคืนสถานะการเลือกจาก Local Storage
  }

  loadAppointments(): void {
    const savedData = localStorage.getItem('notCheckData');
    if (savedData) {
      this.listOfData = JSON.parse(savedData);
      this.filteredData = this.listOfData;
      this.programs = [...new Set(this.listOfData.map(item => item.program_name))];
    } else {
      this.appointmentService.getAppointments().subscribe((data) => {
        this.listOfData = data;
        this.filteredData = data;
        this.programs = [...new Set(data.map(item => item.program_name))];
        localStorage.setItem('notCheckData', JSON.stringify(this.listOfData));
      });
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
    this.saveCheckedState();  // บันทึกสถานะการเลือกเมื่อมีการเปลี่ยนแปลง

    // ตรวจสอบว่ามีข้อมูลที่ถูกเลือกหรือไม่
    const shouldMoveToHistory = this.setOfCheckedId.size > 0; // ตัวแปร Boolean ที่จะใช้

    if (shouldMoveToHistory) {
      this.moveToHistory(shouldMoveToHistory);  // ส่ง Boolean เป็น true
    } else {
      this.stayInNotCheck(shouldMoveToHistory);  // ส่ง Boolean เป็น false
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
    // อัปเดตสถานะการเลือกสำหรับข้อมูลทั้งหมดในหน้าปัจจุบัน
    this.listOfCurrentPageData.forEach(({ id }) => this.updateChecked(id, checked));
    this.refreshCheckedStatus();
    this.saveCheckedState();  // บันทึกสถานะการเลือกเมื่อมีการเปลี่ยนแปลง

    // ตรวจสอบสถานะ Boolean
    const shouldMoveToHistory = checked; // หากเช็คทั้งหมด หมายถึง Boolean เป็น true

    if (shouldMoveToHistory) {
      this.moveToHistory(shouldMoveToHistory);  // ส่ง Boolean เป็น true
    } else {
      this.stayInNotCheck(shouldMoveToHistory);  // ส่ง Boolean เป็น false
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

  moveToHistory(shouldMove: boolean): void {
    const selectedData = this.listOfData.filter(item => this.setOfCheckedId.has(item.id));

    if (selectedData.length > 0 && shouldMove) {
      console.log('Selected data:', selectedData);
      this.selectionService.setSelectedData(selectedData);  // บันทึกข้อมูลที่เลือกลงใน SelectionService

      // เก็บข้อมูลใน localStorage หลังจากส่งไปยัง history
      localStorage.setItem('selectedData', JSON.stringify(selectedData));

      // นำทางไปยังหน้า history โดยอัตโนมัติ
      this.router.navigate(['/history']);
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
      this.refreshCheckedStatus();
    }
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
