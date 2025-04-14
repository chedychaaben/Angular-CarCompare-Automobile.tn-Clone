import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CarrosserieService } from '../services/carrosserie.service';
import { Carrosserie } from 'src/Models/Carrosserie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrosserieform',
  templateUrl: './carrosserieform.component.html',
  styleUrls: ['./carrosserieform.component.css']
})
export class CarrosserieformComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private carrosserieService: CarrosserieService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      image: [null, Validators.required] // File required
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.form.get('image')?.setValue(file);
    }
  }

  onsub() {
    if (this.form.valid) {
      const file = this.form.get('image')?.value;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        formData.append('cloud_name', 'dzd8v4iwt');

        this.http.post<{ secure_url: string }>(
          `https://api.cloudinary.com/v1_1/dzd8v4iwt/image/upload`,
          formData
        ).subscribe(response => {
          const carrosserieData: Carrosserie = {
            id: this.form.get('id')?.value,
            nom: this.form.get('nom')?.value,
            image: response.secure_url
          };

          this.carrosserieService.AddCarrosserie(carrosserieData).subscribe(() => {
            console.log('Carrosserie added successfully');
            this.form.reset();
            this.router.navigate(['/admin/list-carrosseries']);
          });
        });
      } else {
        console.log('No file selected.');
      }
    } else {
      console.log('Form is invalid');
    }
  }
}
