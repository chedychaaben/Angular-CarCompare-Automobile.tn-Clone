import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CarrosserieService } from '../services/carrosserie.service';
import { Carrosserie } from 'src/Models/Carrosserie';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-carrosserie-edit-modal',
  templateUrl: './carrosserie-edit-modal.component.html',
  styleUrls: ['./carrosserie-edit-modal.component.css']
})
export class CarrosserieEditModalComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private carrosserieService: CarrosserieService,
    public dialogRef: MatDialogRef<CarrosserieEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.data);
  }

  initializeForm(): void {
    this.form = this.fb.group({
      id: [this.data.id],
      nom: [this.data.carrosserie.nom, Validators.required],
      image: [this.data.carrosserie.image, Validators.required]
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.form.get('image')?.setValue(file);
    }
  }

  save(): void {
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

          this.carrosserieService.updateCarrosserie(this.form.get('id')?.value ,carrosserieData).subscribe(() => {
            console.log('Carrosserie added successfully');
            this.dialogRef.close(true); // Or pass the new object
          });
        });
      } else {
        console.log('No file selected.');
      }
    } else {
      console.log('Form is invalid');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
