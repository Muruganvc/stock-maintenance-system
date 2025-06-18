import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { ProductService } from '../../shared/services/product.service';
import { IProduct } from '../../shared/models/IProduct';
import { FormMode } from '../../shared/models/formMode';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { KeyValuePair } from '../../shared/models/IKeyValuePair';

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
  fields: any[] = [];
  submitBtntitle: string = 'Submit';
  formMode: FormMode = 'new';

  company: KeyValuePair[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService
  ) {
    this.formGroup = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      company: new FormControl(1, [Validators.required]),
      model: new FormControl(null),
      maximumRetailPrice: new FormControl('', [Validators.required]),
      salesPrice: new FormControl('100', [Validators.required]),
      length: new FormControl(''),
      quantity: new FormControl('', [Validators.required]),
      totalQuantity: new FormControl(),
      purchaseDate: new FormControl(),
      warranty: new FormControl()
    });
  }

  ngOnInit(): void {
    this.fields = [
      {
        type: 'searchable-select',
        name: 'company',
        label: 'New Company Name',
        colSpan: 12,
        options: [] 
      },
      { type: 'input', name: 'model', label: 'Model', colSpan: 6, maxLength: 30 },
      { type: 'input', name: 'maximumRetailPrice', label: 'Maximum retail price ₹', colSpan: 3, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'salesPrice', label: 'Sales Price ₹', colSpan: 3, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'length', label: 'Length (m)', colSpan: 6, maxLength: 30 },
      { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 3, isNumOnly: true, mirrorTo: 'totalQuantity', maxLength: 10 },
      { type: 'input', name: 'totalQuantity', label: 'Total Quantity', colSpan: 3, isNumOnly: true, isReadOnly: true },
      { type: 'date', name: 'purchaseDate', label: 'Purchase Date', colSpan: 3 },
      { type: 'checkbox', name: 'warranty', label: 'Warranty Available', colSpan: 3 }
    ];

    this.fields.forEach(field => {
      if (!this.formGroup.get(field.name)) {
        this.formGroup.addControl(field.name, new FormControl(null));
      }
    });

    this.product = history.state['product'] ?? null;
    if (this.product) {
      this.formMode = 'edit';
      this.submitBtntitle = 'Update';
      this.formGroup.patchValue(this.product);
    }

    this.loadAllCompanies();
    this.setupProductAutocomplete();
    // this.setupFieldMirroring();
  }


  loadAllCompanies(): void {
    this.productService.getCompany().subscribe(response => {
      this.company = response.data;

      const uniqueCompanies = Array.from(
        new Map(
          response.data.map(c => [c.value, {
            value: c.value,      // Now it's just the raw ID
            label: c.key         // The display name
          }])
        ).values()
      );

      this.updateFieldOptions('company', uniqueCompanies);
    });
  }

  setupProductAutocomplete(): void {
    const companyCtrl = this.formGroup.get('company');
    const productCtrl = this.formGroup.get('productName');
    if (!companyCtrl || !productCtrl) return;

    productCtrl.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(productValue => {
        const selectedCompany = companyCtrl.value;

        // Handle both cases: raw ID (e.g. 1) or object { id: 1, name: 'Lisha' }
        const companyId = typeof selectedCompany === 'object' ? selectedCompany.id || selectedCompany.value : selectedCompany;

        if (!companyId) return [];

        return this.productService.getProduct(companyId);
      })
    ).subscribe(response => {
      const uniqueProducts = Array.from(
        new Map(
          response.data.map(p => [
            p.productName,
            {
              value: p.productCompanyId, // or p.productNameId if that's more accurate
              label: p.productName
            }
          ])
        ).values()
      );

      this.updateFieldOptions('productName', uniqueProducts);
    });
  }


  updateFieldOptions(fieldName: string, options: { value: any; label: string }[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) field.options = options;
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

  handleSubmit(form: FormGroup): void {
    if (form.invalid) return;
    const value = form.value;
    const product: IProduct = {
      id: '',
      productName: value.productName?.name || value.productName,
      company: value.company?.name || value.company,
      itemFullName: `${value.productName?.name || value.productName} ${value.company?.name || value.company}`,
      model: value.model,
      maximumRetailPrice: value.maximumRetailPrice,
      salesPrice: value.salesPrice,
      length: value.length,
      quantity: value.quantity,
      totalQuantity: value.totalQuantity,
      purchaseDate: value.purchaseDate || new Date(),
      isWarranty: value.warranty ?? true,
      productCompanyId: value.company?.id,
      productNameId: value.productName?.id
    };
    console.log(product);
    if (this.formMode == 'new') {
      // this.productService.create(product).then(a => console.log(a));
    } else if (this.formMode == 'edit') {
      // this.productService.update(this.product['key'], product);
    }
  }

  cancel(): void {
    this.router.navigate(['/product-list']);
  }
}
