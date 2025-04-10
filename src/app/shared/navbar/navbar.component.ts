import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = computed(() => this.authService.isLoggedIn());
 private currentUser = computed(() => this.authService.getCurrentUser());
  userName = computed(() => this.currentUser() ? this.currentUser()?.displayName : 'Guest');
  
  constructor() {
    
  }
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }
}
