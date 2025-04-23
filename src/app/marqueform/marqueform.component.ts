import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MarqueService } from '../services/marque.service';
import { Marque } from 'src/Models/Marque';
import { Location } from '@angular/common';

@Component({
  selector: 'app-marqueform',
  templateUrl: './marqueform.component.html',
  styleUrls: ['./marqueform.component.css']
})
export class MarqueformComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private marqueService: MarqueService,
    private location: Location
  ) {}

  ngOnInit() {
    // Initialize the form with form controls and validation
    this.form = this.fb.group({
      nom: ['', Validators.required],
      pays: ['', Validators.required],
      logo: [null, Validators.required]
    });
  }
  goBack(): void {
    this.location.back();
  }
  
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.form.get('logo')?.setValue(file);
    }
  }

  onsub() {
    if (this.form.valid) {
      const file = this.form.get('logo')?.value;

      if (file) {
        const FormImageDataForCloudinary = new FormData();
        FormImageDataForCloudinary.append('file', file); // Append the file to formData
        FormImageDataForCloudinary.append('upload_preset', 'ml_default'); // Add your preset
        FormImageDataForCloudinary.append('cloud_name', 'dzd8v4iwt'); // Your Cloudinary cloud name

        console.log('File selected:', file.name);
        this.http.post<{ secure_url: string }>(
          `https://api.cloudinary.com/v1_1/dzd8v4iwt/image/upload`, 
          FormImageDataForCloudinary
        ).subscribe(response => {
          console.log('Uploaded Image URL:', response.secure_url);
          const marqueData: Marque = {
            id: this.form.get('id')?.value,
            nom: this.form.get('nom')?.value,
            pays: this.form.get('pays')?.value,
            logo: response.secure_url // Store the uploaded image URL
          };

          this.marqueService.AddMarque(marqueData).subscribe(() => {
            console.log('Marque added successfully');
            this.form.reset(); // Optionally reset the form
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
