import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  registerUser() {
    if (this.registerForm.invalid) {
      this.registerError = 'Veuillez remplir tous les champs correctement.';
      return;
    }

    const { email, password, role } = this.registerForm.value;

    this.authService.register(email, password, role).subscribe({
      next: () => {
        this.registerError = null;

        // Attempt to login immediately after registration
        this.authService.login(email, password).subscribe({
          next: () => this.router.navigate(['/home']),
          error: () => this.router.navigate(['/login'])
        });
      },
      error: (err) => {
        this.registerError = err?.message || 'Erreur lors de l’inscription.';
      }
    });
  }
}
