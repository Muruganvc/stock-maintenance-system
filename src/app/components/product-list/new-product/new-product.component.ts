import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormComponent } from "../../shared/dynamic-form/dynamic-form.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent {
  form: FormGroup;
  constructor(private router: Router) {
    this.form = new FormGroup({
      firstName: new FormControl('Muruganvc', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      userName: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      emailId: new FormControl('', [Validators.required, Validators.email]),
      mobileNumner: new FormControl('', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
      role: new FormControl('admin', [Validators.required]),
      isActice: new FormControl(true),
      superAdmin: new FormControl(true)
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // this.http.get<any>('https://api.example.com/user/123')
    //   .subscribe(user => {

    //   });

    this.form.patchValue({
      firstName: 'Murugan',
      lastName: 'Chidambaram',
      emailId: 'vcmuruganmca@gmail.com',
      mobileNumber: '9994277980',
      role: 'admin',
      isActive: true,
      superAdmin: true
    });
  }

  fields = [
    { type: 'input', name: 'productName', label: 'Product Name', colSpan: 12 },
    {
      type: 'select', name: 'productType', label: 'Product Type', colSpan: 6, options: [
        { value: 'switch', label: 'Switch' },
        { value: 'wire', label: 'Wire' },
        { value: 'socket', label: 'Socket' },
        { value: 'plug', label: 'Plug' },
        { value: 'fuse', label: 'Fuse' },
      ]
    },
    { type: 'input', name: 'brand', label: 'Brand', colSpan: 6 },
    { type: 'input', name: 'modelNumber', label: 'Model Number', colSpan: 6 },
    { type: 'input', name: 'voltage', label: 'Voltage (V)', colSpan: 3 },
    { type: 'input', name: 'amperage', label: 'Amperage (A)', colSpan: 3 },
    { type: 'input', name: 'length', label: 'Length (m)', colSpan: 6 },
    { type: 'input', name: 'price', label: 'Price ₹', colSpan: 6 },
    { type: 'input', name: 'stock', label: 'Available Stock', colSpan: 3 },
    { type: 'date', name: 'purchaseDate', label: 'Purchase Date', colSpan: 3 },
    { type: 'checkbox', name: 'warranty', label: 'Warranty Available', colSpan: 3 },
    { type: 'toggle', name: 'isActive', label: 'Active Product', colSpan: 3 },
    { type: 'input', name: 'description', label: 'Product Description', colSpan: 12 },
  ];
  cancel() {
    this.router.navigate(['/product-list']);
  }
}
