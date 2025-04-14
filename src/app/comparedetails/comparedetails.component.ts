import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Comparison } from 'src/Models/Comparison';
import { Voiture } from 'src/Models/Voiture';
import { VoitureService } from 'src/app/services/voiture.service';

type VoitureWithExtras = Voiture & {
  marque_nom?: string;
  carrosserie_nom?: string;
};

@Component({
  selector: 'app-comparedetails',
  templateUrl: './comparedetails.component.html',
  styleUrls: ['./comparedetails.component.css']
})
export class ComparedetailsComponent implements OnInit {
  comparisonId!: string;
  comparison!: Comparison;
  carOne: VoitureWithExtras | null = null;
  carTwo: VoitureWithExtras | null = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, 
              private http: HttpClient,
              public voitureService: VoitureService,) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.comparisonId = params.get('id') || '';
      this.fetchComparison();
    });
  }

  fetchComparison(): void {
    this.http.get<Comparison>(`http://localhost:3000/comparisons/${this.comparisonId}`).subscribe(comparison => {
      this.comparison = comparison;
      this.fetchCars(comparison.voitureuneid, comparison.voituredeuxid);
      
    });
  }
  
  fetchCars(id1: string, id2: string): void {
    this.voitureService.getVoitureById(id1).subscribe(car1 => {
      this.carOne = car1;
      if (this.carTwo) this.isLoading = false;
    });
    this.voitureService.getVoitureById(id2).subscribe(car2 => {
      this.carTwo = car2;
      if (this.carOne) this.isLoading = false;
    });
  }
}