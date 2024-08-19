import { Component } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgZorroModule,CommonModule,FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {
  selectedData: any[] = [];

  constructor(private selectionService: SelectionService) {}

  ngOnInit(): void {
    this.selectedData = this.selectionService.getSelectedData(); // ดึงข้อมูลจาก service
  }
}
