import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from "../shared/custom-table/custom-table.component";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CustomTableComponent,
    MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  constructor(private router: Router) { }

  products: any[] = [
  {
    id: 1,
    productName: 'Anchor Switch',
    productType: 'Switch',
    brand: 'Havells',
    modelNumber: 'SWX123',
    voltage: '240',
    amperage: '16',
    length: '90',
    price: '250',
    stock: '100',
    purchaseDate: '14-01-2025',
    warranty: 'Yes',
    isActive: 'true',
    description: 'Premium wall switch for indoor use'
  },
  {
    id: 2,
    productName: 'LED Tube Light',
    productType: 'Light',
    brand: 'Philips',
    modelNumber: 'LT987',
    voltage: '220',
    amperage: '20',
    length: '120',
    price: '450',
    stock: '60',
    purchaseDate: '10-02-2025',
    warranty: 'No',
    isActive: 'true',
    description: 'Energy efficient LED tube'
  },
  {
    id: 3,
    productName: 'Mini Circuit Breaker',
    productType: 'MCB',
    brand: 'Schneider',
    modelNumber: 'MCB45X',
    voltage: '230',
    amperage: '32',
    length: '15',
    price: '320',
    stock: '80',
    purchaseDate: '05-03-2025',
    warranty: 'Yes',
    isActive: 'false',
    description: 'Safety MCB with overload protection'
  },
  {
    id: 4,
    productName: 'Ceiling Fan',
    productType: 'Fan',
    brand: 'Usha',
    modelNumber: 'CFN890',
    voltage: '230',
    amperage: '50',
    length: '140',
    price: '1800',
    stock: '40',
    purchaseDate: '20-03-2025',
    warranty: 'Yes',
    isActive: 'true',
    description: 'High-speed ceiling fan'
  },
  {
    id: 5,
    productName: 'Extension Box',
    productType: 'Accessory',
    brand: 'Anchor',
    modelNumber: 'EXTB10',
    voltage: '240',
    amperage: '10',
    length: '25',
    price: '350',
    stock: '75',
    purchaseDate: '12-04-2025',
    warranty: 'No',
    isActive: 'true',
    description: 'Extension box with 5 sockets'
  },
  {
    id: 6,
    productName: 'Power Cable',
    productType: 'Cable',
    brand: 'Finolex',
    modelNumber: 'PC125',
    voltage: '250',
    amperage: '15',
    length: '100',
    price: '600',
    stock: '120',
    purchaseDate: '01-04-2025',
    warranty: 'Yes',
    isActive: 'true',
    description: 'Flexible power cable for home wiring'
  },
  {
    id: 7,
    productName: 'Smart Plug',
    productType: 'Plug',
    brand: 'Wipro',
    modelNumber: 'SPM202',
    voltage: '230',
    amperage: '10',
    length: '5',
    price: '799',
    stock: '35',
    purchaseDate: '15-04-2025',
    warranty: 'Yes',
    isActive: 'true',
    description: 'WiFi-enabled smart plug'
  },
  {
    id: 8,
    productName: 'LED Panel Light',
    productType: 'Light',
    brand: 'Syska',
    modelNumber: 'PL450',
    voltage: '230',
    amperage: '12',
    length: '30',
    price: '999',
    stock: '50',
    purchaseDate: '18-04-2025',
    warranty: 'Yes',
    isActive: 'true',
    description: 'Flat LED panel for false ceiling'
  },
  {
    id: 9,
    productName: 'MCB Box',
    productType: 'Box',
    brand: 'L&T',
    modelNumber: 'BX70',
    voltage: '230',
    amperage: '40',
    length: '35',
    price: '650',
    stock: '20',
    purchaseDate: '22-04-2025',
    warranty: 'No',
    isActive: 'false',
    description: 'Durable metal MCB box'
  },
  {
    id: 10,
    productName: 'Dimmer Switch',
    productType: 'Switch',
    brand: 'Havells',
    modelNumber: 'DMS150',
    voltage: '240',
    amperage: '10',
    length: '10',
    price: '200',
    stock: '90',
    purchaseDate: '25-04-2025',
    warranty: 'Yes',
    isActive: 'true',
    description: 'Rotary dimmer switch for lights'
  },
  {
    id: 11,
    productName: 'AC Stabilizer',
    productType: 'Stabilizer',
    brand: 'V-Guard',
    modelNumber: 'VG100',
    voltage: '230',
    amperage: '20',
    length: '45',
    price: '2200',
    stock: '18',
    purchaseDate: '28-04-2025',
    warranty: 'Yes',
    isActive: 'true',
    description: 'Voltage stabilizer for 1.5 ton AC'
  },
  {
    id: 12,
    productName: 'Plug Adapter',
    productType: 'Adapter',
    brand: 'GM',
    modelNumber: 'AD101',
    voltage: '240',
    amperage: '6',
    length: '5',
    price: '150',
    stock: '150',
    purchaseDate: '30-04-2025',
    warranty: 'No',
    isActive: 'true',
    description: 'Universal plug adapter'
  },
  {
    id: 13,
    productName: 'Surface LED Light',
    productType: 'Light',
    brand: 'Bajaj',
    modelNumber: 'SLED40',
    voltage: '220',
    amperage: '15',
    length: '25',
    price: '700',
    stock: '60',
    purchaseDate: '02-05-2025',
    warranty: 'Yes',
    isActive: 'true',
    description: 'Surface mounted round LED'
  },
  {
    id: 14,
    productName: 'Industrial Plug',
    productType: 'Plug',
    brand: 'Siemens',
    modelNumber: 'IP300',
    voltage: '440',
    amperage: '63',
    length: '20',
    price: '1800',
    stock: '10',
    purchaseDate: '05-05-2025',
    warranty: 'Yes',
    isActive: 'false',
    description: 'Heavy duty 3-phase plug'
  },
  {
    id: 15,
    productName: 'LAN Cable',
    productType: 'Cable',
    brand: 'D-Link',
    modelNumber: 'CAT6-305',
    voltage: '0',
    amperage: '0',
    length: '305',
    price: '3500',
    stock: '25',
    purchaseDate: '10-05-2025',
    warranty: 'No',
    isActive: 'true',
    description: 'CAT6 Ethernet LAN cable'
  }
];


  columns: { key: string; label: string; align: 'left' | 'center' | 'right' }[] = [
    { key: 'productName', label: 'Product Name', align: 'left' },
    { key: 'productType', label: 'Product Type', align: 'right' },
    { key: 'brand', label: 'Brand', align: 'right' },
    { key: 'modelNumber', label: 'ModelNumber', align: 'right' },
    { key: 'voltage', label: 'Voltage(V)', align: 'right' },
    { key: 'amperage', label: 'Amperage(A)', align: 'right' },
    { key: 'length', label: 'Length (m)', align: 'right' },
    { key: 'price', label: 'Price ₹', align: 'right' },
    { key: 'stock', label: 'Available Stock', align: 'right' },
    { key: 'purchaseDate', label: 'Purchase Date', align: 'right' },
    { key: 'warranty', label: 'Warranty Available', align: 'right' },
    { key: 'isActive', label: 'Active Product', align: 'right' },
    { key: 'description', label: 'Product Description', align: 'right' }
  ];

  onEdit(user: any) {
    console.log('Edited:', user);
  }

  onDelete(user: any) {
    this.products = this.products.filter(u => u.id !== user.id);
  }

  newOpen(a: any) {
    this.router.navigate(['/new-product']);
  }
}
