export interface AutoCompleteOption<T = any> {
  value: T;
  label: string;
}


export type ColumnAlign = 'left' | 'center' | 'right';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  align: ColumnAlign;
}