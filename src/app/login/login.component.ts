import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private authService: AuthService) {}
  email = '';
  password = '';

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        // Handle success (e.g., navigate to another page)
      },
      error: (err) => {
        console.error('Login failed:', err);
        // Handle error (e.g., show error message to user)
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
