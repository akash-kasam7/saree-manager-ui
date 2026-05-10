import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class BillService {
  private apiUrl = environment.apiUrl + '/bills';

  constructor(private http: HttpClient) {}

  uploadAndExtract(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/extract`, formData);
  }

  getAllBills(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  confirmSave(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm-save`, formData);
  }

  addPayment(billId: number, paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${billId}/payments`, paymentData);
  }

  askGemini(query: string): Observable<{response: string}> {
    return this.http.get<{response: string}>(`${this.apiUrl}/chat`, { params: { query } });
  }
}