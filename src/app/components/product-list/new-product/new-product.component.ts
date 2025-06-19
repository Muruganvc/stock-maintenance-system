import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { ProductService } from '../../shared/services/product.service';
import { IProduct} from '../../shared/models/IProduct';
import { FormMode } from '../../shared/models/formMode';
import { MatSelectChange } from '@angular/material/select';
import { IProductTypeRequest, IProductTypeResponse } from '../../shared/models/IProductTypeRequest';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent implements OnInit {
  formGroup!: FormGroup;
  fields: any[] = [];
  submitBtntitle = 'Submit';
  formMode: FormMode = 'new';
  product: IProductTypeResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService
  ) {
    this.formGroup = new FormGroup({
      company: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      product: new FormControl(null, [Validators.required]),
      mrp: new FormControl('', [Validators.required]),
      salesPrice: new FormControl('', [Validators.required]),
      taxPercent: new FormControl(''),
      brandName: new FormControl(''),
      description: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.fields = [
      { type: 'searchable-select', name: 'company', label: 'Company', colSpan: 3, options: [] },
      { type: 'searchable-select', name: 'category', label: 'Category', colSpan: 3, options: [] },
      { type: 'searchable-select', name: 'product', label: 'Product Name', colSpan: 6, options: [] },
      { type: 'input', name: 'mrp', label: 'MRP ₹', colSpan: 3, isNumOnly: true },
      { type: 'input', name: 'salesPrice', label: 'Sales Price ₹', colSpan: 3, isNumOnly: true },
      { type: 'input', name: 'taxPercent', label: 'Tax %', colSpan: 3, isNumOnly: true, maxLength: 2 },
      { type: 'input', name: 'brandName', label: 'Brand Name', colSpan: 3 },
      { type: 'textarea', name: 'description', label: 'Description', colSpan: 12 }
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
      // this.formGroup.patchValue(this.product);
      this.formGroup.patchValue({
        company: this.product.categoryId,
        category: this.product.categoryId,
        product: this.product.productTypeId,
        description: this.product.description,
        mrp: this.product.mrp,
        salesPrice: this.product.salesPrice
        // taxType: this.product.t,
        // barCode: this.product.barCode,
        // brandName: this.product.brandName
      });
    }
    this.loadAllCompanies();
    this.handleCompanyChange();
    this.handleCategoryChange();
  }

  loadAllCompanies(): void {
    this.productService.getCompany().subscribe(response => {
      const companies = response.data.map((c: any) => ({
        value: c.value,
        label: c.key
      }));
      this.updateFieldOptions('company', companies);

      // const currentValue = this.formGroup.get('company')?.value;
      // const matched = companies.find(c => c.value === currentValue);
      // if (matched) this.formGroup.get('company')?.setValue(matched.value);
    });
  }

  handleCompanyChange(): void {
    this.formGroup.get('company')?.valueChanges.subscribe(companyId => {
      if (!companyId) return;
      this.productService.getCategories(companyId).subscribe(response => {
        const categories = response.data.map((c: any) => ({
          value: c.value,
          label: c.key
        }));
        this.updateFieldOptions('category', categories);
        // const currentValue = this.formGroup.get('category')?.value;
        // const matched = categories.find(c => c.value === currentValue);
        // if (matched) this.formGroup.get('category')?.setValue(matched.value);

        // this.formGroup.get('category')?.reset();
        // this.formGroup.get('productName')?.reset();
        // this.updateFieldOptions('productName', []);
      });
    });
  }

  handleCategoryChange(): void {
    this.formGroup.get('category')?.valueChanges.subscribe(categoryId => {
      if (!categoryId) return;
      this.productService.getProductCategories(categoryId).subscribe(response => {
        const products = response.data.map((p: any) => ({
          value: p.value,
          label: p.key
        }));
        this.updateFieldOptions('product', products);

        // const currentValue = this.formGroup.get('productName')?.value;
        // const matched = products.find(c => c.value === currentValue);
        // if (matched) this.formGroup.get('productName')?.setValue(matched.value);

        // this.formGroup.get('productName')?.reset();
      });
    });
  }

  updateFieldOptions(fieldName: string, options: { value: any; label: string }[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) field.options = options;
  }

  handleSubmit(form: FormGroup): void {
    if (form.invalid) return;
    const value = form.value;
    const product: IProductTypeRequest = {
      productName: value.productName?.label || value.productName,
      companyId :value.company,
      categoryId: value.company?.label || value.company,
      description:value.description,
      mrp: value.mrp,
      salesPrice: value.salesPrice,
      totalQuantity: value.totalQuantity,
    };
    console.log(product);
    if (this.formMode === 'new') {
      // this.productService.create(product).subscribe();
    } else if (this.formMode === 'edit') {
      // this.productService.update(this.product?.id, product).subscribe();
    }
  }

  cancel(): void {
    this.router.navigate(['/product-list']);
  }

  dropdownChange(controlName: string, event: MatSelectChange) {
    if (controlName == 'company') {
      this.formGroup.get('category')?.reset();
      this.formGroup.get('product')?.reset();
      this.updateFieldOptions('category', []);
      this.updateFieldOptions('product', []);
    } else if (controlName == 'category') {
      this.formGroup.get('product')?.reset();
      this.updateFieldOptions('product', []);
    }
  }
}