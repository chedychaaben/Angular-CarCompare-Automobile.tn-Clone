import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataset, ChartOptions, registerables } from 'chart.js';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Vu } from 'src/Models/Vu';
import { VuService } from '../services/vu.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  vus : Vu[] = [];
  
  constructor(
    private afAuth: AngularFireAuth,
    private vuService: VuService,
  ) {}

  ngOnInit() {
    // getting user id
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.vuService.GetVusByUserId(user.uid).subscribe((data) => {
          this.vus = data;
        });
      }
    });
  }

  chartData: ChartDataset[] = [
    {
      label: 'Your viewing history per day (last 7 days)',
      data: [3,2,2,2,5,7,10]
    }
  ];

  chartLabels: string[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };
}
