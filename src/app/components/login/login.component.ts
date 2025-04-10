import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user: User | null = null;
   loginerror = false;
   errorMessage="Invalid email or password";
  email = '';
  password = '';
  displayName = '';
  isRegisterMode = false;

  constructor(private authService: AuthService) {}

  login() {
    this.authService.loginWithGoogle().subscribe(user => this.user = user);
  }

  loginWithEmail() {
    if(this.email.trim() && this.password.trim()) {
    this.authService.loginWithEmail(this.email, this.password).subscribe(
      (user) => {this.user = user;this.loginerror = false;},
    (error) => {this.loginerror = true;}
    );}
    else{
      this.loginerror = true;
    }
  }

  registerWithEmail() {
    this.authService.registerWithEmail(this.email, this.password, this.displayName).subscribe(user => this.user = user);
  }

  logout() {
    this.authService.logout();
    this.user = null;
  }

  toggleMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }
}
