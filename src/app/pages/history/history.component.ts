import { Component, OnInit } from '@angular/core';
import { NgZorroModule } from '../../../shared/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectionService } from '../selection.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [NgZorroModule, CommonModule, FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  selectedData: any[] = [];

  constructor(private selectionService: SelectionService) {}

  ngOnInit(): void {
    const savedData = localStorage.getItem('selectedData');
    if (savedData) {
      this.selectedData = JSON.parse(savedData);
    } else {
      this.selectedData = this.selectionService.getSelectedData();
    }
    console.log('Data in history:', this.selectedData);
  }
}
