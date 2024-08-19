import { Component, inject, OnInit } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../appointment.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-not-check',
  standalone: true,
  imports: [NgZorroModule, CommonModule, FormsModule, ModalComponent],
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
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.appointmentService.getAppointments().subscribe((data) => {
      this.listOfData = data;
      this.filteredData = data;
      this.programs = [...new Set(data.map(item => item.program_name))];
    });
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly any[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateChecked(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach(({ id }) => this.updateChecked(id, checked));
    this.refreshCheckedStatus();
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
    instance.data = data;
  }

  deleteRow(id: number): void {
    this.filteredData = this.filteredData.filter(item => item.id !== id);
  }

}
