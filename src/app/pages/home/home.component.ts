import { Component, inject } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

interface DataItem {
  id: number;
  date: string;
  name: string;
  phone: string;
  assessment: string;
  assessmentClass: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgZorroModule,CommonModule,FormsModule,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  isCollapsed = false;
  private router = inject(Router);

  navigateToCheck() {
    this.router.navigate(['home/check']);
  }

  navigateToHistory() {
    this.router.navigate(['home/history']);
  }

  logout(): void {
    // คุณสามารถเพิ่ม logic สำหรับการ logout ได้ที่นี่
    console.log('User logged out');
    // อาจทำการนำทางไปที่หน้า login หรือหน้าอื่นๆ
    this.router.navigate(['/welcome']);
  }

}
