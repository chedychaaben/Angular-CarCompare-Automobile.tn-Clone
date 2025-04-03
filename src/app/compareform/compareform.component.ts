import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VoitureService } from '../services/voiture.service';
import { CarrosserieService } from 'src/app/services/carrosserie.service';
import { CompareService } from '../services/compare.service';
import { MarqueService } from '../services/marque.service';
import { Voiture } from 'src/Models/Voiture';
import { Comparison } from 'src/Models/Comparison';

@Component({
  selector: 'app-compareform',
  templateUrl: './compareform.component.html',
  styleUrls: ['./compareform.component.css']
})
export class CompareformComponent implements OnInit {
  searchForm!: FormGroup;
  filteredModels: string[] = [];
  voitureOneId: string | null = null;
  marques: any[] = [];
  carrosseries: any[] = [];
  voitures: Voiture[] = [];
  latestVoitures: Voiture[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private voitureService: VoitureService,
    private carrosserieService: CarrosserieService,
    private marqueService: MarqueService,
    private compareService: CompareService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.voitureOneId = params.get('voiture1');
      if (!this.voitureOneId) {
        this.route.queryParamMap.subscribe(queryParams => {
          this.voitureOneId = queryParams.get('voiture1');
        });
      }
    });
  
    this.searchForm = this.fb.group({
      marque: '',
      carrosserie: '',
      model: ''
    });
  
    // Fetch all voitures first, then check if voitureOneId exists
    this.voitureService.GetAllVoitures().subscribe(data => {
      this.voitures = data;
      
      // Check if voitureOneId exists in voitures list
      const exists = this.voitures.some(v => v.id === this.voitureOneId);
      if (!exists) {
        console.error('Error 404: Car not found');
        this.router.navigate(['/']); // Redirect to a home page
      }
    });
  
    this.marqueService.GetAllMarques().subscribe(data => (this.marques = data));
    this.carrosserieService.GetAllCarrosseries().subscribe(data => (this.carrosseries = data));
    this.voitureService.getLatestVoitures().subscribe(data => (this.latestVoitures = data));
  
    // Listen to form changes
    this.searchForm.get('marque')?.valueChanges.subscribe(selectedMarqueId => {
      const selectedCarrosrieId = this.searchForm.get('carrosserie')?.value;
      this.filterModels(selectedCarrosrieId, selectedMarqueId);
    });
  
    this.searchForm.get('carrosserie')?.valueChanges.subscribe(selectedCarrosrieId => {
      const selectedMarqueId = this.searchForm.get('marque')?.value;
      this.filterModels(selectedCarrosrieId, selectedMarqueId);
    });
  }
  
  

  filterModels(selectedCarrosrieId: string, selectedMarqueId: string): void {
    if (!selectedMarqueId || !selectedCarrosrieId) {
      this.filteredModels = [];
      return;
    }

    this.filteredModels = this.voitures
      .filter(voiture => voiture.marque === selectedMarqueId && voiture.carrosserie === selectedCarrosrieId)
      .map(voiture => voiture.model);
  }

  onSearch() {
    const { marque, carrosserie, model } = this.searchForm.value;

    const selectedCar = this.voitures.find(
      v => v.marque === marque && v.carrosserie === carrosserie && v.model === model
    );

    if (selectedCar?.id) {
      const compareData: Comparison = {
        voitureuneid: this.voitureOneId as string,
        voituredeuxid: selectedCar.id as string,
        userid: '',
        datetime: new Date()
      };
      
      this.compareService.AddComparison(compareData).subscribe((response: any) => {
        console.log('Comparison added successfully');
        if (response?.id) {
          this.router.navigate(['/comparison-result'], { queryParams: { id: response.id } });
        } else {
          console.warn('No ID returned from the server');
        }
      });
      
      
    } else {
      console.warn('No matching car found!');
    }
  }
}