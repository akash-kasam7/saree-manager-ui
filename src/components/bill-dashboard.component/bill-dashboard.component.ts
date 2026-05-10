import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BillService } from '../../services/billService.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { PaymentDialogComponent } from '../payment-dialog.component/payment-dialog.component';

@Component({
  selector: 'app-bill-dashboard',
  standalone: true,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, 
    MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatDialogModule
  ],
  templateUrl: './bill-dashboard.component.html',
  styleUrls: ['./bill-dashboard.component.scss']
})
export class BillDashboardComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  columnsToDisplay = ['billDate', 'billNo', 'manufacturerName', 'amount', 'status', 'action'];
  expandedElement: any | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private billService: BillService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadBills();
  }

  loadBills() {
    this.billService.getAllBills().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  get totals() {
    const bills = this.dataSource.data || [];
    const now = new Date();
    const currMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    const currYear = now.getFullYear().toString();
    const currentMonthKey = `${currYear}-${currMonth}`;

    return {
      outstanding: bills.reduce((acc, b) => acc + (b.amount - (b.paidAmount || 0)), 0),
      monthStock: bills.filter(b => b.billDate && b.billDate.includes(currentMonthKey))
                       .reduce((acc, b) => acc + b.amount, 0),
      monthPaid: bills.flatMap(b => b.payments || [])
                      .filter(p => p.paymentDate && p.paymentDate.includes(`/${currMonth}/`))
                      .reduce((acc, p) => acc + p.amountPaid, 0)
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openPaymentDialog(bill: any) {
    const dialogRef = this.dialog.open(PaymentDialogComponent, { width: '400px', data: bill });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.billService.addPayment(bill.id, result).subscribe(() => this.loadBills());
      }
    });
  }

  sendWhatsApp(bill: any) {
    const balance = bill.amount - (bill.paidAmount || 0);
    const text = `Hi ${bill.manufacturerName}, regarding Bill No: ${bill.billNo} for ₹${bill.amount}. Balance remaining: ₹${balance}.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  downloadPDF() {
    const doc = new jsPDF();
    doc.text("Saree Manager - Outstanding Bills", 14, 15);
    autoTable(doc, {
      head: [['Date', 'Bill #', 'Manufacturer', 'Total', 'Paid', 'Status']],
      body: this.dataSource.filteredData.map(b => [
        b.billDate, b.billNo, b.manufacturerName, b.amount, (b.paidAmount || 0), b.status
      ]),
    });
    doc.save('shop_report.pdf');
  }
}