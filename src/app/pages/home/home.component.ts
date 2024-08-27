import { Component, inject } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgZorroModule,CommonModule,FormsModule,RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private router = inject(Router);

  navigateToCheck() {
    console.log('Navigating to check');
    this.router.navigate(['/home/check']);
  }

  navigateToHistory() {
    console.log('Navigating to history');
    this.router.navigate(['/home/history']);
  }


  logout(): void {
    console.log('User logged out');
    this.router.navigate(['/welcome']);
  }
}
