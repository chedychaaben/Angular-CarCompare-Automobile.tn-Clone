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
  selector: 'app-dashboardcomparisons',
  templateUrl: './dashboardcomparisons.component.html',
  styleUrls: ['./dashboardcomparisons.component.css']
})
export class DashboardcomparisonsComponent implements OnInit{
  today: Date = new Date();
  comparisons : ComparisonWithCars[] = [];
  lastFiveComparisons : ComparisonWithCars[] = [];
  voitures : Voiture[] = [];

  
  constructor(
    private afAuth: AngularFireAuth,
    private compareService: CompareService,
    private voitureService: VoitureService,
  ) {}
  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // First get all voitures
        this.voitureService.GetAllVoitures().subscribe((data) => {
          this.voitures = data;
  
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
            .filter(comp => comp.voitureUne && comp.voitureDeux)
            .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
            

            this.lastFiveComparisons = this.comparisons.slice(0, 5);

            this.updateStackedComparedChart();
          });
        });
      }
    });
  }
  
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
  updateStackedComparedChart() {
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
