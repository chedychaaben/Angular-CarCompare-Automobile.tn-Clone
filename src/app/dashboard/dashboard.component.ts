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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  today: Date = new Date();
  vus : Vu[] = [];
  favoris : Favori[] = [];
  comparisons : ComparisonWithCars[] = [];
  voitures : Voiture[] = [];
  newestVu: Vu | null = null;
  newestVoiture: Voiture | null = null;

  
  constructor(
    private afAuth: AngularFireAuth,
    private vuService: VuService,
    private favoriService: FavoriService,
    private compareService: CompareService,
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
  
            // Get the newest vu
            const newestVu = this.vus.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0];
            this.newestVu = newestVu;
  
            // Get the voiture of the newest vu
            this.newestVoiture = this.voitures.find(voiture => voiture.id === newestVu.voitureid) || null;
  
            // After the VUs and voitures are loaded, now load favoris
            this.favoriService.GetFavorisByUserId(user.uid).subscribe((favorisData) => {
              this.favoris = favorisData;
  
              // After favoris are loaded, now load comparisons
              this.compareService.GetComparisonsByUserId(user.uid).subscribe((comparisonsData) => {
                this.comparisons = comparisonsData
                .map(comp => {
                  const voitureUne = this.voitures.find(voiture => voiture.id === comp.voitureuneid);
                  const voitureDeux = this.voitures.find(voiture => voiture.id === comp.voituredeuxid);

                  return {
                    ...comp,
                    voitureUne,
                    voitureDeux
                  };
                })
                .filter(comp => comp.voitureUne && comp.voitureDeux) // ✅ Keep only if both exist
                .slice(0, 5);
  
                // 
                this.updateLikeRateChart();
                this.updateLikedMarquesChart();
                this.updateViewedMarquesChart();
                this.updateViewingChart();
                this.updateStackedComparedChart();
              });
            });
          });
        });
      }
    });
  }
  
  getLastNDaysLabels(n: number): string[] {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    const result: string[] = [];
    const today = new Date();
  
    for (let i = n-1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      result.push(days[date.getDay()]);
    }
  
    return result;
  }

  // INIT
  viewingTrendsData: ChartDataset[] = [
    {
      label: 'Your viewing history per day (last 7 days)',
      data: []
    }
  ];
  viewingTrendsLabels: string[] = this.getLastNDaysLabels(7);
  viewingTrendsOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };
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
        position: 'top', // Legend at the top
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label} ${tooltipItem.raw}`; // Show percentage in tooltip
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

  // INIT
  StackedComparedChartData: ChartDataset[] = [];
  StackedComparedChartLabels: string[] = [];
  StackedComparedChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `Value: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      }
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


  //
  getStartOfCurrentWeek(): Date {
    const now = new Date();
    const day = now.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(now.setDate(diff));
  }
  processDayCounts(rawData: Vu[]): { labels: string[], data: number[] } {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const countMap = new Map<string, number>();
  
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6); // includes today
  
    rawData.forEach(item => {
      const dateObj = new Date(item.datetime);
      // keep only items within the last 7 days
      if (dateObj >= sevenDaysAgo && dateObj <= today) {
        const dayName = days[dateObj.getDay()];
        countMap.set(dayName, (countMap.get(dayName) || 0) + 1);
      }
    });
  
    const labels = this.getLastNDaysLabels(7);
    const data = labels.map(day => countMap.get(day) || 0);
    return { labels, data };
  }
  
  updateViewingChart() {
    
    const result = this.processDayCounts(this.vus);
  
    this.viewingTrendsLabels = result.labels;
    this.viewingTrendsData = [
      {
        label: 'Your viewing history per day (last 6 days)',
        data: result.data,
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.3,
      }
    ];
  }

  // TREAT
  updateViewedMarquesChart() {
    const marqueCounts: { [marque: string]: number } = {};
  
    this.vus.forEach(vu => {
      const voiture = this.voitures.find(v => v.id === vu.voitureid);
      if (voiture) {
        marqueCounts[voiture.marque] = (marqueCounts[voiture.marque] || 0) + 1;
      }
    });
  
    // Convert to array of [marque, count], sort, and slice top 5
    const sortedMarques = Object.entries(marqueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

    const labels = sortedMarques.map(([marque]) => marque);
    const data = sortedMarques.map(([, count]) => count);
  
    this.ViewedMarquesLabels = labels;
    this.ViewedMarquesData = [{
      label: 'Views by Marque',
      data: data,
      backgroundColor: '#36a2eb'
    }];
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

  // Treat

  updateStackedComparedChart() {
    // Initialize counters
    let totalEssenceAutomatique = 0;
    let totalDieselAutomatique = 0;
    let totalElectriqueAutomatique = 0;
    let totalHybrideAutomatique = 0;

    let totalEssenceManuelle = 0;
    let totalDieselManuelle = 0;
    let totalElectriqueManuelle = 0;
    let totalHybrideManuelle = 0;

    // Loop over comparisons
    this.comparisons.forEach(comparison => {
      const voitures = [comparison.voitureUne, comparison.voitureDeux];
      
      voitures.forEach(voiture => {
        const transmission = voiture?.transmission?.toLowerCase();
        const fuel = voiture?.fuel?.toLowerCase();

        if (transmission === 'automatique') {
          if (fuel === 'essence') totalEssenceAutomatique++;
          else if (fuel === 'diesel') totalDieselAutomatique++;
          else if (fuel === 'electrique') totalElectriqueAutomatique++;
          else if (fuel === 'hybride') totalHybrideAutomatique++;
        } else if (transmission === 'manuelle') {
          if (fuel === 'essence') totalEssenceManuelle++;
          else if (fuel === 'diesel') totalDieselManuelle++;
          else if (fuel === 'electrique') totalElectriqueManuelle++;
          else if (fuel === 'hybride') totalHybrideManuelle++;
        }
      });
    });
    
    // Prepare final datasets
    const automatiqueData = [
      totalEssenceAutomatique,
      totalDieselAutomatique,
      totalElectriqueAutomatique,
      totalHybrideAutomatique
    ];

    const manuelleData = [
      totalEssenceManuelle,
      totalDieselManuelle,
      totalElectriqueManuelle,
      totalHybrideManuelle
    ];

    // Update the full dataset array (not just data inside)
    this.StackedComparedChartData = [
      {
        label: 'Automatique',
        data: automatiqueData,
        backgroundColor: '#FF6384'
      },
      {
        label: 'Manuelle',
        data: manuelleData,
        backgroundColor: '#36A2EB'
      }
    ];
  
    // If you also want to update labels (optional)
    this.StackedComparedChartLabels = ['Essence', 'Diesel', 'Électrique', 'Hybride'];
  }
}
