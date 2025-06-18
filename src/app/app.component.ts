import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './components/shared/services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'stock-maintenance-system';
  constructor(private authService: AuthService) {
  if (authService.isLoggedIn()) {
    this.authService.loadUserPermissions().subscribe();
  }
}
}
