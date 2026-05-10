import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BillService } from '../../services/billService.service';

@Component({
  selector: 'app-ask-anything',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl:'./ask-anything-component.html'
})
export class AskAnythingComponent {
  userQuery = '';
  loading = false;
  chatHistory: {role: string, text: string}[] = [];

  constructor(private billService: BillService, private cdr: ChangeDetectorRef) {}

  send() {
    if (!this.userQuery.trim()) return;
    
    const query = this.userQuery;
    this.chatHistory.push({ role: 'user', text: query });
    this.userQuery = '';
    this.loading = true;

    this.billService.askGemini(query).subscribe({
      next: (res) => {
        this.chatHistory.push({ role: 'bot', text: res.response });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chatHistory.push({ role: 'bot', text: 'Sorry, I failed to get an answer.' });
        this.loading = false;
        this.cdr.detectChanges();

      }
    });
  }
}