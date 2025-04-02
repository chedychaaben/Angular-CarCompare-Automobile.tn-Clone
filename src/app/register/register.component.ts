import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email = '';
  password = '';
  role = 'user'; // Default role

  constructor(private authService: AuthService) {}

  registerUser() {
    this.authService.register(this.email, this.password, this.role);
  }
}
