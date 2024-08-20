import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AppointmentService } from '../../appointment.service'; // นำเข้า AppointmentService

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [CommonModule]  // เพิ่ม CommonModule ที่นี่
})
export class ModalComponent implements OnInit {
  @Input() data: any; // ข้อมูลที่ส่งเข้ามาจากคอมโพเนนต์แม่
  appointmentDetails: any; // เก็บรายละเอียดของนัดหมาย

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    if (this.data && this.data.id) {
      // เรียกใช้ service เพื่อดึงข้อมูลรายละเอียดของนัดหมาย
      this.appointmentService.getAppointmentDetails(this.data.id).subscribe(details => {
        this.appointmentDetails = details;
      });
    }
  }
}
