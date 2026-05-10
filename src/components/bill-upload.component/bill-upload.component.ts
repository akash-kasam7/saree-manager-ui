import { ChangeDetectorRef, Component } from '@angular/core';
import { BillService } from '../../services/billService.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({ 
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-bill-upload',
  templateUrl: './bill-upload.component.html'
})
export class BillUploadComponent {
  selectedFiles: File[] = [];
  loading = false;
  saving = false;
  extractedBills: any[] = []; 

  constructor(private billService: BillService, private cdr: ChangeDetectorRef) {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  upload() {
    if (this.selectedFiles.length === 0) return;
    this.loading = true;
    this.extractedBills = [];

    const uploadTasks = this.selectedFiles.map(file => 
      this.billService.uploadAndExtract(file)
    );

    forkJoin(uploadTasks).subscribe({
      next: (results) => {
        this.extractedBills = results.map(data => 
          typeof data === 'string' ? JSON.parse(data) : data
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        alert("Extraction failed for one or more files.");
        this.loading = false;
      }
    });
  }

  saveAll() {
    if (this.extractedBills.length === 0) return;
    this.saving = true;
    let completedCount = 0;

    this.extractedBills.forEach((bill, index) => {
      const formData = new FormData();
      formData.append('file', this.selectedFiles[index]);
      formData.append('bill', new Blob([JSON.stringify(bill)], { type: 'application/json' }));

      this.billService.confirmSave(formData).subscribe({
        next: () => {
          completedCount++;
          if (completedCount === this.extractedBills.length) {
            alert("All bills saved successfully!");
            this.extractedBills = [];
            this.selectedFiles = [];
            this.saving = false;
            this.cdr.detectChanges();
          }
        },
        error: () => {
          alert(`Failed to save bill for ${bill.manufacturerName}`);
          this.saving = false;
        }
      });
    });
  }
}