import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-custom-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss'
})
export class CustomTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: { key: string; label: string; editable?: boolean, align: string }[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  columnKeys: string[] = [];
  columnKeysWithActions: string[] = [];
  filteredData: any[] = [];
  pagedData: any[] = [];
  searchTerm = '';
  isMobile = false;
  pageSize = 5;
  currentPage = 0;

  editingRow: any = null;
  editedRowData: any = {};
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private bp: BreakpointObserver) { }

  sortData(columnKey: string): void {
    if (this.sortColumn === columnKey) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column sorted
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }

    this.filteredData = [...this.filteredData].sort((a, b) => {
      const valueA = a[columnKey];
      const valueB = b[columnKey];

      if (valueA == null || valueB == null) return 0;

      const compare = typeof valueA === 'number'
        ? valueA - valueB
        : String(valueA).localeCompare(String(valueB));

      return this.sortDirection === 'asc' ? compare : -compare;
    });

    this.updatePagedData();
  }

  ngOnInit(): void {
    this.columnKeys = this.columns.map(c => c.key);
    this.columnKeysWithActions = [...this.columnKeys, 'actions'];
    this.filteredData = [...this.data];
    this.updatePagedData();

    // ✅ Observe all relevant breakpoints
    this.bp.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall] || result.breakpoints[Breakpoints.Small]) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }

      // Optional: log current breakpoint
      console.log('isMobile:', this.isMobile);
    });
  }

  applySearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(row =>
      this.columnKeys.some(key => (row[key] + '').toLowerCase().includes(term))
    );
    this.currentPage = 0;
    this.updatePagedData();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedData();
  }

  updatePagedData() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedData = this.filteredData.slice(start, end);
  }

  onEditClick(row: any) {
    this.editingRow = row;
    this.editedRowData = { ...row };
  }

  onSaveClick() {
    const index = this.data.findIndex(d => d === this.editingRow);
    if (index !== -1) {
      this.data[index] = { ...this.editedRowData };
      this.applySearch();
      this.edit.emit(this.data[index]); // emit updated row
    }
    this.editingRow = null;
    this.editedRowData = {};
  }
  onCancelClick() {
    this.editingRow = null;
    this.editedRowData = {};
  }

  getValue(item: any) {
    debugger;
    return item.key;
  }
}