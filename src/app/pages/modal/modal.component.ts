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
  formatPhoneNumber(phone: string): string {
    // แปลงเบอร์โทรศัพท์ให้อยู่ในรูปแบบ 000-000-0000
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  formatIdCard(idCard: string): string {
    // แปลงเลขบัตรประชาชนให้อยู่ในรูปแบบ 0-0000-00000-00-0
    return idCard.replace(/(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})/, '$1-$2-$3-$4-$5');
  }
}
