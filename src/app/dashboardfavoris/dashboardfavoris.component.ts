import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataset, ChartOptions, registerables } from 'chart.js';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Vu } from 'src/Models/Vu';
import { Favori } from 'src/Models/Favori';
import { Comparison } from 'src/Models/Comparison';
import { Voiture } from 'src/Models/Voiture';

import { VuService } from '../services/vu.service';
import { FavoriService } from '../services/favori.service';
import { CompareService } from '../services/compare.service';
import { VoitureService } from '../services/voiture.service';

export interface ComparisonWithCars extends Comparison {
  voitureUne?: Voiture;
  voitureDeux?: Voiture;
}

Chart.register(...registerables);

@Component({
  selector: 'app-dashboardfavoris',
  templateUrl: './dashboardfavoris.component.html',
  styleUrls: ['./dashboardfavoris.component.css']
})
export class DashboardfavorisComponent implements OnInit{
  today: Date = new Date();
  vus : Vu[] = [];
  favoris : Favori[] = [];
  comparisons : ComparisonWithCars[] = [];
  voitures : Voiture[] = [];

  
  constructor(
    private afAuth: AngularFireAuth,
    private vuService: VuService,
    private favoriService: FavoriService,
    private voitureService: VoitureService,
  ) {}
  
  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // First get all voitures
        this.voitureService.GetAllVoitures().subscribe((data) => {
          this.voitures = data;
  
          // Now get the VUs by UserId
          this.vuService.GetVusByUserId(user.uid).subscribe((vusData) => {
            this.vus = vusData;
  
            this.favoriService.GetFavorisByUserId(user.uid).subscribe((favorisData) => {
              this.favoris = favorisData;
  
                this.updateLikeRateChart();
                this.updateLikedMarquesChart();
              });
            });
        });
      }
    });
  }
  
  // INIT
  LikeRateData: ChartDataset[] = [
    {
      label: 'Doughnut Chart',
      backgroundColor: ['#ff6384', '#36a2eb'],
      hoverBackgroundColor: ['#ff4384', '#36a2eb'],
      data: []
    }
  ];
  LikeRateLabels: string[] = ["Likes","Viewes"];
  LikeRateOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label} ${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  // INIT
  ViewedMarquesData: ChartDataset[] = [];
  ViewedMarquesLabels: string[] = [];
  ViewedMarquesOptions: ChartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Car Marques Viewed' }
    }
  };
  // INIT
  LikedMarquesData: ChartDataset[] = [];
  LikedMarquesLabels: string[] = [];
  LikedMarquesOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Top Liked Marques' }
    }
  };
  // Treat
  updateLikeRateChart() {
    this.LikeRateData = [
      {
        label: 'Liked vs Viewed',
        data: [this.favoris?.length || 0, this.vus?.length || 0]
      }
    ];
  }
  // Treat
  updateLikedMarquesChart() {
    const marqueCounts: { [marque: string]: number } = {};
  
    this.favoris.forEach(fav => {
      const voiture = this.voitures.find(v => v.id === fav.voitureid);
      if (voiture) {
        marqueCounts[voiture.marque] = (marqueCounts[voiture.marque] || 0) + 1;
      }
    });
  
    // Get top 5 liked marques
    const sorted = Object.entries(marqueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  
    const labels = sorted.map(([marque]) => marque);
    const data = sorted.map(([, count]) => count);
  
    this.LikedMarquesLabels = labels;
    this.LikedMarquesData = [{
      label: 'Top Liked Marques',
      data: data,
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }];
  }

}
