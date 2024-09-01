import { Component, Input, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ModalComponent implements OnInit {
  @Input() data: any;
  appointmentDetails: any;

  constructor(private appointmentService: AppointmentService, private modal: NzModalRef) {}

  ngOnInit(): void {
    if (this.data && this.data.id) {
      this.appointmentService.getAppointmentDetails(this.data.id).subscribe(details => {
        this.appointmentDetails = details;
      });
    }
  }
  formatPhoneNumber(phone: string): string {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  formatIdCard(idCard: string): string {
    return idCard.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5');
  }
}
