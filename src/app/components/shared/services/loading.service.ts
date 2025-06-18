import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  constructor(private spinner: NgxSpinnerService) {}

  show(name: string = 'default') {
    this.spinner.show(name);
  }

  hide(name: string = 'default') {
    this.spinner.hide(name);
  }

  showAutoHide(name: string = 'default', timeout = 2000) {
    this.show(name);
    setTimeout(() => this.hide(name), timeout);
  }
}
