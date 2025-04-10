import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
        // handle success
      },
      error: (err) => {
        this.registerError = err?.message || 'Erreur lors de l’inscription.';
      }
    });
  }
}
