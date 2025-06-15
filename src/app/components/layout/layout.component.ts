import { Component, signal, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { CustomSidenavComponent } from "../custom-sidenav/custom-sidenav.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../shared/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatTooltipModule, MatSidenavModule, RouterModule, MatListModule, CustomSidenavComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  // readonly isMobile = signal(true);

  isMobileDevice = false;
  sidebarExpanded = true;


  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private dialog: MatDialog, private authService: AuthService) {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobileDevice = result.matches;
        if (this.isMobileDevice) this.sidebarExpanded = false;
      });
  }

  isMobile(): boolean {
    return this.isMobileDevice;
  }

  toggleSidebar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  onNavigate() {
    if (this.isMobile()) {
      document.querySelector('mat-sidenav')?.dispatchEvent(new Event('closedStart'));
    }
  }

  toggleSubMenu(item: any) {
    if (item.children) {
      item.expanded = !item.expanded;
    } else {
      this.router.navigate([item.route]);
      this.onNavigate();
    }
  }

  isActive(item: any): boolean {
    return this.router.url === item.route;
  }
  logout() {
    this.openConfirm('');
  }

  openConfirm(key: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      disableClose: true,
      data: {
        title: 'Logout',
        message: 'Are you sure you want to Logout?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
