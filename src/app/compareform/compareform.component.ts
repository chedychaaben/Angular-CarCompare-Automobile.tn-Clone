import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VoitureService } from '../services/voiture.service';
import { CompareService } from '../services/compare.service';
import { Voiture } from 'src/Models/Voiture';
import { Comparison } from 'src/Models/Comparison';

@Component({
  selector: 'app-compareform',
  templateUrl: './compareform.component.html',
  styleUrls: ['./compareform.component.css']
})
export class CompareformComponent implements OnInit{
  form!: FormGroup;

  voitures: Voiture[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private voitureService: VoitureService,
    private compareService: CompareService    
  ) {}
  
  ngOnInit() {
    this.initializeForm();
    this.loadVoitures();
  }

    initializeForm() {
      this.form = this.fb.group({
        voiture_1: ['', Validators.required],
        voiture_2: ['', Validators.required],
      });
    }
  
    loadVoitures() {
      this.voitureService.GetAllVoitures().subscribe((data) => {
        this.voitures = data;
      });
    }

    getSelectedImage(value: string): string {
      const selectedCar = this.voitures.find(v => `${v.marque}-${v.model}` === value);
      return selectedCar ? selectedCar.image : '';
    }

    onsub() {
      console.log(this.voitures);
      console.log("Voiture 1 est : ", this.form.get('voiture_1')?.value);
      console.log("Voiture 2 est : ", this.form.get('voiture_2')?.value);
      if (this.form.valid) {
        const compareData: Comparison = {
          id: this.form.get('id')?.value,
          voitureuneid: this.form.get('voiture_1')?.value,
          voituredeuxid: this.form.get('voiture_2')?.value,
          userid: "",
          datetime: new Date()
        };

        this.compareService.AddComparison(compareData).subscribe(() => {
          console.log('Comparison added successfully');
          this.form.reset();
        });

      } else {
        console.log('Form is invalid');
      }
    }

}
