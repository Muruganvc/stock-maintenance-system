import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, map, pairwise, scan, startWith } from 'rxjs/operators';
import { DynamicFormComponent } from '../../shared/dynamic-form/dynamic-form.component';
import { ProductService } from '../../shared/services/product.service';
import { FormMode } from '../../shared/models/formMode';
import { IGetProductsQueryResponse, IProductRequest } from '../../shared/models/IProductTypeRequest';
import { KeyValuePair } from '../../shared/models/IKeyValuePair';
import { DataService } from '../../shared/services/data.service';

function salesPriceLessThanMRPValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const mrp = group.get('mrp')?.value;
    const salesPrice = group.get('salesPrice')?.value;

    if (mrp != null && salesPrice != null && Number(salesPrice) > Number(mrp)) {
      return {
        salesPriceExceedsMRP: {
          message: 'Sales Price should not exceed MRP'
        }
      };
    }
    return null;
  };
}

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [DynamicFormComponent],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss'
})
export class NewProductComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  fields: any[] = [];
  submitBtntitle = 'Submit';
  formMode: FormMode = 'new';
  product: IGetProductsQueryResponse | null = null;

  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly dataService = inject(DataService);

  ngOnInit(): void {
    this.initForm();
    this.initFields();
    this.loadAllCompanies();
    this.bindCompanyChange();
    this.bindCategoryChange();
    this.bindQuantityChange();
    this.product = history.state['product'] ?? null;
  }

  ngOnDestroy(): void {
    // If you add manual subscriptions later, clean them up here
  }

  private initForm(): void {
    this.formGroup = new FormGroup({
      company: new FormControl(null, Validators.required),
      category: new FormControl(null, Validators.required),
      product: new FormControl(null),
      mrp: new FormControl('', Validators.required),
      salesPrice: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      availableQuantity: new FormControl(100),
      taxPercent: new FormControl(''),
      taxType: new FormControl(''),
      barCode: new FormControl(''),
      brandName: new FormControl(''),
      description: new FormControl('')
    }, { validators: salesPriceLessThanMRPValidator() });
  }

  private initFields(): void {
    this.fields = [
      { type: 'searchable-select', name: 'company', label: 'Company', colSpan: 3, options: [] },
      { type: 'searchable-select', name: 'category', label: 'Category', colSpan: 3, options: [] },
      { type: 'searchable-select', name: 'product', label: 'Product Name', colSpan: 6, options: [] },
      { type: 'input', name: 'mrp', label: 'MRP ₹', colSpan: 3, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'salesPrice', label: 'Sales Price ₹', colSpan: 3, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'quantity', label: 'Quantity', colSpan: 3, isNumOnly: true, maxLength: 8 },
      { type: 'input', name: 'availableQuantity', label: 'Available Quantity', colSpan: 3, isReadOnly: true },
      { type: 'input', name: 'taxPercent', label: 'Tax %', colSpan: 3, isNumOnly: true, maxLength: 2 },
      { type: 'input', name: 'taxType', label: 'Tax Type', colSpan: 3, maxLength: 5 },
      { type: 'input', name: 'barCode', label: 'Bar Code', colSpan: 3 },
      { type: 'input', name: 'brandName', label: 'Brand Name', colSpan: 3 },
      { type: 'textarea', name: 'description', label: 'Description', colSpan: 12 }
    ];
  }

  private loadAllCompanies(): void {
    this.productService.getCompany().subscribe({
      next: res => this.updateFieldOptions('company', res.data),
      error: err => console.error('Company Load Error:', err)
    });
  }

  private bindCompanyChange(): void {
    this.formGroup.get('company')?.valueChanges.pipe(
      filter(value => !!value)
    ).subscribe(selected => {
      console.log('Company selected:', selected);

      // Reset category and product fields and their options
      this.formGroup.patchValue({ category: null, product: null });
      this.updateFieldOptions('category', []);
      this.updateFieldOptions('product', []);

      this.loadCategories(selected.value);
    });
  }

  private bindCategoryChange(): void {
    this.formGroup.get('category')?.valueChanges.pipe(
      filter(value => !!value)
    ).subscribe(selected => {
      console.log('Category selected:', selected);

      // Reset product field and its options
      this.formGroup.patchValue({ product: null });
      this.updateFieldOptions('product', []);

      this.loadProducts(selected.value);
    });
  }

  private loadCategories(companyId: number): void {
    this.productService.getCategories(companyId).subscribe({
      next: res => this.updateFieldOptions('category', res.data),
      error: err => console.error('Category Load Error:', err)
    });
  }

  private loadProducts(categoryId: number): void {
    this.productService.getProductCategories(categoryId).subscribe({
      next: res => this.updateFieldOptions('product', res.data),
      error: err => console.error('Product Load Error:', err)
    });
  }

  private updateFieldOptions(fieldName: string, options: KeyValuePair[]): void {
    const field = this.fields.find(f => f.name === fieldName);
    if (field) field.options = options;
  }

  private bindQuantityChange(): void {
    const quantityControl = this.formGroup.get('quantity');
    const availableControl = this.formGroup.get('availableQuantity');

    const initialAvailable = 100;
    availableControl?.setValue(initialAvailable, { emitEvent: false });

    quantityControl?.valueChanges.pipe(
      startWith(''),
      map(val => Number(val) || 0),   // convert to number, treat empty as 0
      pairwise(),                     // gives [previous, current]
      map(([prev, curr]) => {
        const diff = curr - prev;
        return diff;
      })
    ).subscribe(diff => {
      const current = Number(availableControl?.value) || 0;
      const updated = current + diff;
      availableControl?.setValue(updated, { emitEvent: false });
    });
  }

  handleSubmit(form: FormGroup): void {
    console.log('Form Submitted:', form.value);
    if (form.invalid) return;
    const value = form.value;
    const product: IProductRequest = {
      barCode: value.barCode,
      brandName: value.brandName,
      productCategoryId: value.product?.value,
      categoryId: value.category.value,
      companyId: value.company.value,
      description: value.description,
      mrp: value.mrp,
      productName: `${value.company.key} ${value.category.key} ${value.product?.key}`,
      totalQuantity: value.availableQuantity,
      salesPrice: value.salesPrice,
      taxPercent: value.taxPercent,
      taxType: value.taxType
    };

    this.productService.createProduct(product).subscribe({
      next: result => {
        this.dataService.showSuccessMessage("New Product Created.");
        this.formGroup.reset();
      },
      error: er => {
        this.dataService.showErrorMessage("An error occurs");
      }
    });
  }

  activatProduct = (): void => {
      
  }

  cancel(): void {
    this.router.navigate(['/product-list']);
  }
  dropdownChange(a: any, b: any) {

  }

}
