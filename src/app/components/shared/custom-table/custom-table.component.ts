import { Component, effect, EventEmitter, input, Input, OnChanges, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon'
import { LayoutModule } from '@angular/cdk/layout';
import { MatExpansionModule } from '@angular/material/expansion';
export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

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
    MatButtonModule, MatIconModule,
    LayoutModule, MatExpansionModule
  ],
  templateUrl: './custom-table.component.html',
  styleUrl: './custom-table.component.scss'
})
export class CustomTableComponent<T extends TableRow> implements OnChanges {
  searchTerm = '';
  applyFilter(): void {
    if (!this.isMobile) {
      this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    }
    // On mobile, filteredData getter will take care of filtering
  }
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() showCheckbox = false;
  @Input() showActions = true;

  title = input.required();
  addBtnTitle = input();

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<T>([]);
  displayedColumns: string[] = [];

  editRowId: TableRow['id'] | null = null;
  editedRow: Partial<T> = {};

  isMobile = false;
  isTablet = false;

  constructor(private breakpointObserver: BreakpointObserver) { }

  get filteredData(): T[] {
    const term = this.searchTerm?.toLowerCase() || '';
    if (!term) return this.data;

    return this.data.filter(row =>
      this.columns.some(col => {
        const value = row[col.key];
        return value?.toString().toLowerCase().includes(term);
      })
    );
  }
  pageIndex = 0;
  pageSize = 5;
  get paginatedMobileData(): T[] {
    const start = this.pageIndex * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
  get paginatorLength(): number {
    return Math.max(this.dataSource.filteredData.length, 1);
  }

  ngOnInit() {
    this.breakpointObserver.observe([
      '(max-width: 699px)',    // mobile
      '(max-width: 1024px)'    // tablet
    ]).subscribe(result => {
      this.isMobile = result.breakpoints['(max-width: 699px)'];
      this.isTablet = result.breakpoints['(max-width: 1024px)'] && !this.isMobile;
    });
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource(this.data || []);
    this.dataSource.paginator = this.paginator;
    this.displayedColumns = this.columns.map(c => c.key);
    if (this.showActions) this.displayedColumns.push('actions');
    if (this.showCheckbox) this.displayedColumns.unshift('select');
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  startEdit(row: T) {
    this.editRowId = row.id;
    this.editedRow = { ...row };
  }

  saveRow() {
    const updated = { ...this.editedRow } as T;
    const index = this.data.findIndex(d => d.id === updated.id);
    if (index > -1) {
      this.data[index] = updated;
      this.dataSource.data = [...this.data];
      this.edit.emit(updated);
    }
    this.cancelEdit();
  }

  cancelEdit() {
    this.editRowId = null;
    this.editedRow = {};
  }

  deleteRow(row: T) {
    this.delete.emit(row);
  }

  isEditing(row: T) {
    return this.editRowId === row.id;
  }
  getIconClass(type: string): string {
    switch (type) {
      case 'info': return 'icon-info';
      case 'warning': return 'icon-warning';
      case 'error': return 'icon-error';
      default: return 'icon-default';
    }
  }
}