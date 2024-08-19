import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  private selectedData: any[] = [];

  addSelectedData(data: any): void {
    this.selectedData.push(data);
  }

  getSelectedData(): any[] {
    return this.selectedData;
  }

  clearSelectedData(): void {
    this.selectedData = [];
  }
}
