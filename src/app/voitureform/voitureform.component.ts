import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MarqueService } from '../services/marque.service';
import { VoitureService } from '../services/voiture.service';
import { CarrosserieService } from '../services/carrosserie.service';
import { Marque } from 'src/Models/Marque';
import { Voiture } from 'src/Models/Voiture';
import { Carrosserie } from 'src/Models/Carrosserie';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-voitureform',
  templateUrl: './voitureform.component.html',
  styleUrls: ['./voitureform.component.css']
})
export class VoitureformComponent implements OnInit {
  form!: FormGroup;
  marques: Marque[] = [];
  carrosseries: Carrosserie[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private marqueService: MarqueService,
    private voitureService: VoitureService,
    private carrosserieService: CarrosserieService,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadMarques();
    this.loadCarrosseries();
  }
  goBack(): void {
    this.location.back();
  }
  initializeForm() {
    this.form = this.fb.group({
      marque: ['', Validators.required],
      model: ['', Validators.required],
      carrosserie: ['', Validators.required],
      moteur: ['', Validators.required],
      prix: ['', [Validators.required, Validators.min(0)]],
      image: [null, Validators.required],
      nbports: ['', Validators.required],
      nbchaises: ['', Validators.required],
      year: ['', [Validators.required, Validators.min(1886)]],
      drivetrain: ['', Validators.required],
      fuel: ['', Validators.required],
      transmission: ['', Validators.required],
      horsepower: ['', [Validators.required, Validators.min(0)]],
      topspeed: ['', [Validators.required, Validators.min(0)]],
      acceleration: ['', [Validators.required, Validators.min(0)]],
    });
  }

  loadMarques() {
    this.marqueService.GetAllMarques().subscribe((data) => {
      this.marques = data;
    });
  }

  loadCarrosseries() {
    this.carrosserieService.GetAllCarrosseries().subscribe((data) => {
      this.carrosseries = data;
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
          const voitureData: Voiture = {
            id: this.form.get('id')?.value,
            marque: this.form.get('marque')?.value,
            model: this.form.get('model')?.value,
            carrosserie: this.form.get('carrosserie')?.value,
            moteur: this.form.get('moteur')?.value,
            prix: this.form.get('prix')?.value,
            image: response.secure_url,
            nbports: this.form.get('nbports')?.value,
            nbchaises: this.form.get('nbchaises')?.value,
            year: this.form.get('year')?.value,
            drivetrain: this.form.get('drivetrain')?.value,
            fuel: this.form.get('fuel')?.value,
            transmission: this.form.get('transmission')?.value,
            horsepower: this.form.get('horsepower')?.value,
            topspeed: this.form.get('topspeed')?.value,
            acceleration: this.form.get('acceleration')?.value
          };

          this.voitureService.AddVoiture(voitureData).subscribe(() => {
            console.log('Voiture added successfully');
            this.form.reset();
            this.router.navigate(['/admin/list-voitures']);
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
