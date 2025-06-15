import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  items = Array.from({ length: 50 }, (_, i) => ({
    name: `Item ${i + 1}`,
    qty: 2,
    rate: 100 + i,
  }));

  customer = {
    name: 'Murugan vc',
    address: 'Veerappanayakkan patty, Harur TN-636906',
  };

  company = {
    name: 'Electric Co.',
    logo: 'img/TheeranChinnamalai.jfif',
    address: 'Theerthamalai, Harur TN-636906',
  };

  today = new Date();
  currentPage = 0;
  pageSize = 10;
  pagedItems = this.items;
  totalAmount = 0;

  constructor(private sanitizer: DomSanitizer) {}

  base64Logo: SafeUrl | null = null;
  isLogoReady = false;

  ngOnInit() {
    this.updatePageData();
    this.totalAmount = this.items.reduce((sum, item) => sum + item.qty * item.rate, 0);
    this.convertImageToBase64('assets/img/TheeranChinnamalai.jfif');
  }
   convertImageToBase64(imagePath: string) {
    fetch(imagePath)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.base64Logo = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
          this.isLogoReady = true;
        };
        reader.readAsDataURL(blob);
      });
  }

  updatePageData() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.items.slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePageData();
  }

  printInvoice() {
    const printContents = document.getElementById('print-all')!.innerHTML;
    const popupWin = window.open('', '_blank', 'width=800,height=600');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>${this.getPrintStyles()}</style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContents}
        </body>
      </html>
    `);
    popupWin!.document.close();
  }

  getPrintStyles(): string {
    return `
      body {
        font-family: 'Segoe UI', sans-serif;
        padding: 20px;
      }
      .invoice-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #ccc;
        margin-bottom: 1rem;
      }
      .invoice-header img {
        height: 50px;
      }
      .invoice-section {
        margin-bottom: 1rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
      }
      th {
        background: #1976d2;
        color: white;
      }
      .totals {
        text-align: right;
        font-weight: bold;
      }
    `;
  }
}