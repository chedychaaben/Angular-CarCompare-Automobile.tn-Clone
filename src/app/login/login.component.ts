import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  email = '';
  password = '';
  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        console.log('✅ Login successful:', user);
        // Redirect or handle success
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loginError = err?.message;
      }
    });
  }
  

}
