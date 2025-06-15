import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../shared/models/IProduct';
import { LoadingSpinnerComponent } from "../../shared/loading-spinner/loading-spinner.component";
import { FormMode } from '../../shared/models/formMode';
@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent implements OnInit {
  formGroup!: FormGroup;
  products: IProduct[] = [];
  product: IProduct;
  submitBtntitle: string = 'Submit'
  formMode: FormMode = 'new';
  fields = [
    // {
    //   type: 'autocomplete', name: 'company1', label: 'Company', colSpan: 6, options: [
    //     'Anchor', 'Philips', 'Havells', 'GM', 'Syska', 'Lisha'
    //   ]
    // },
    { type: 'input', name: 'productName', label: 'Product Name', colSpan: 6, maxLength: 30 },
    { type: 'input', name: 'company', label: 'Company', colSpan: 6, maxLength: 30 },
    // {
    //   type: 'select', name: 'company', label: 'Company', colSpan: 6, options: [
    //     { value: 'Lisha', label: 'Lisha' },
    //     { value: 'HiFi', label: 'HiFi' },
    //     { value: 'anchor ', label: 'Anchor ' },
    //     { value: 'plug', label: 'Plug' },
    //     { value: 'fuse', label: 'Fuse' }
    //   ]
    // },
    { type: 'input', name: 'model', label: 'Model', colSpan: 6, maxLength: 30 },
    { type: 'input', name: 'maximumRetailPrice', label: 'Maximum retail price ₹', colSpan: 3, isNumOnly: true, maxLength: 8 },
    { type: 'input', name: 'salesPrice', label: 'Sales Price ₹', colSpan: 3, isNumOnly: true, maxLength: 8 },
    { type: 'input', name: 'length', label: 'Length (m)', colSpan: 6, maxLength: 30 },
    { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 3, isNumOnly: true, mirrorTo: 'totalQuantity', maxLength: 10 },
    { type: 'input', name: 'totalQuantity', label: 'Total Quantity', colSpan: 3, isNumOnly: true, isReadOnly: true },
    { type: 'date', name: 'purchaseDate', label: 'Purchase Date', colSpan: 3 },
    { type: 'checkbox', name: 'warranty', label: 'Warranty Available', colSpan: 3 }
  ];

  constructor(private fb: FormBuilder, private router: Router, private productService: ProductService) {
    this.formGroup = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      company: new FormControl('', [Validators.required]),
      model: new FormControl(null),
      maximumRetailPrice: new FormControl('', [Validators.required]),
      salesPrice: new FormControl('', [Validators.required]),
      length: new FormControl(''),
      quantity: new FormControl('', [Validators.required]),
      totalQuantity: new FormControl(),
      purchaseDate: new FormControl(),
      warranty: new FormControl()
    });
  }

  ngOnInit(): void { 
    this.fields.forEach(field => {
      this.formGroup.addControl(field.name, new FormControl(null));
    });
    this.product = history.state['product'] ?? null;
    if (this.product) {
      this.formMode = 'edit';
      this.submitBtntitle = 'Update';
      this.formGroup.patchValue(this.product);
    }
    this.getProducts(); 
    // this.setupFieldMirroring();
  }

  setupFieldMirroring(): void {
    this.fields.forEach(field => {
      if (field.mirrorTo) {
        const source = this.formGroup.get(field.name);
        const target = this.formGroup.get(field.mirrorTo);

        if (source && target) {
          let previous = 0;
          source.valueChanges.subscribe(val => {
            const current = Number(val) || 0;
            const delta = current - previous;
            const total = Number(target.value) || 0;
            target.setValue(total + delta, { emitEvent: false });
            previous = current;
          });
        }
      }
    });
  }

  getProducts() {
    this.productService.getAll().snapshotChanges().subscribe(actions => {
      this.products = actions.map(action => {
        const data = action.payload.val() as IProduct;
        const key = action.key;
        return { key, ...data };
      });
    });
  }

  handleSubmit(form: FormGroup): void { 
    if (form.invalid) return;
    const value = form.value;
    const product: IProduct = {
      id: '',
      productName: value.productName,
      company: value.company,
      itemFullName: `${value.productName} ${value.company}`,
      model: value.model,
      maximumRetailPrice: value.maximumRetailPrice,
      salesPrice: value.salesPrice,
      length: value.length,
      quantity: value.quantity,
      totalQuantity: value.totalQuantity,
      purchaseDate: value.purchaseDate || new Date(),
      isWarranty: value.isWarranty ?? true
    };
    console.log(product);
    if (this.formMode == 'new') {
      this.productService.create(product).then(a => {
        console.log(a);
      });
    } else if (this.formMode == 'edit') {
      this.productService.update(this.product['key'], product);
    } ;
  }

  cancel(): void {
    this.router.navigate(['/product-list']);
  }
}
