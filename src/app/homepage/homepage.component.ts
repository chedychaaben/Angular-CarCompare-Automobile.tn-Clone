import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { CarrosserieService } from 'src/app/services/carrosserie.service';
import { VoitureService } from 'src/app/services/voiture.service';
import { MarqueService } from 'src/app/services/marque.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
  marques: any[] = [];
  carrosseries: any[] = [];
  voitures: any[] = [];
  filteredModels: string[] = [];
  searchForm: FormGroup;

  
  latestVoitures: any[] = [];


  constructor(
    private carrosserieService: CarrosserieService,
    private voitureService: VoitureService,
    private marqueService: MarqueService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      marque: '',
      carrosserie: '',
      model: ''
    });
  }

  ngOnInit(): void {
    // Fetch all data
    this.marqueService.GetAllMarques().subscribe(data => this.marques = data);
    this.carrosserieService.GetAllCarrosseries().subscribe(data => this.carrosseries = data);
    this.voitureService.GetAllVoitures().subscribe(data => this.voitures = data);

    // Listen to form changes
    this.searchForm.get('marque')?.valueChanges.subscribe(selectedMarqueId => {
      const selectedCarrosrieId = this.searchForm.get('carrosserie')?.value;
      this.filterModels(selectedCarrosrieId, selectedMarqueId);
    });

    this.searchForm.get('carrosserie')?.valueChanges.subscribe(selectedCarrosrieId => {
      const selectedMarqueId = this.searchForm.get('marque')?.value;
      this.filterModels(selectedCarrosrieId, selectedMarqueId);
    });

    
    this.voitureService.getLatestVoitures().subscribe(data => this.latestVoitures = data);


    console.log(this.carrosseries);
  }

  /**
   * Filters car models based on selected marque and carrosserie.
   */
  filterModels(selectedCarrosrieId: string, selectedMarqueId: string): void {
    // Find the marque object from the selected ID
    const selectedMarque = this.marques.find(m => m.id === selectedMarqueId);
    if (!selectedMarque) {
      this.filteredModels = [];
      return;
    }

    // Filter voitures based on marque ID and carrosserie ID
    this.filteredModels = this.voitures
      .filter(voiture => voiture.marque === selectedMarqueId && voiture.carrosserie === selectedCarrosrieId)
      .map(voiture => voiture.model);
  }


  /**
   * Searches for voitures based on selected criteria.
   */
  onSearch() {
    const { marque, carrosserie, model } = this.searchForm.value;

    // Find the car that matches selected marque, carrosserie, and model
    const selectedCar = this.voitures.find(
      v => v.marque === marque && v.carrosserie === carrosserie && v.model === model
    );

    if (selectedCar) {
      this.router.navigate(['/voiture-details'], { queryParams: { id: selectedCar.id } });
    } else {
      console.warn('No matching car found!');
    }
  }
};