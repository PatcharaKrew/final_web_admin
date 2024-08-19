import { Component, inject } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { MOCK_DATA } from '../mock-data';
import { ModalComponent } from '../modal/modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-not-check',
  standalone: true,
  imports: [NgZorroModule,CommonModule,FormsModule,ModalComponent],
  templateUrl: './not-check.component.html',
  styleUrl: './not-check.component.scss'
})
export class NotCheckComponent {

  listOfData = MOCK_DATA;
  filteredData = MOCK_DATA;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly any[] = [];
  selectedProgram = '';

  programs = [...new Set(MOCK_DATA.map(item => item.appointmentProgram))];

  constructor(private modal: NzModalService) {}

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
      this.filteredData = this.listOfData.filter(item => item.appointmentProgram === this.selectedProgram);
    } else {
      this.filteredData = this.listOfData;
    }
  }

  isRiskVisible(): boolean {
    return this.selectedProgram === 'ตรวจสุขภาพ' || this.selectedProgram === 'เลิกบุหรี่';
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
