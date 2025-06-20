import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {
constructor(private router: Router) {}

  ngOnInit(): void {
    // Prevent back navigation while on this page
    history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      history.pushState(null, '', window.location.href);
    };
  }

  // Optional navigation away button
  goToHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
