import { Component, OnInit } from '@angular/core';
import { Chart, ChartDataset, ChartOptions, registerables } from 'chart.js';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { Vu } from 'src/Models/Vu';
import { Favori } from 'src/Models/Favori';
import { Comparison } from 'src/Models/Comparison';

import { VuService } from '../services/vu.service';
import { FavoriService } from '../services/favori.service';
import { CompareService } from '../services/compare.service';


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
  comparisons : Comparison[] = [];
  
  constructor(
    private afAuth: AngularFireAuth,
    private vuService: VuService,
    private favoriService: FavoriService,
    private compareService: CompareService,
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.vuService.GetVusByUserId(user.uid).subscribe((data) => {
          this.vus = data;
          this.updateViewingChart();
        });
  
        this.favoriService.GetFavorisByUserId(user.uid).subscribe((data) => {
          this.favoris = data;
          this.updateLikeRateChart();
        });
  
        this.compareService.GetComparisonsByUserId(user.uid).subscribe((data) => {
          this.comparisons = data;
        });
      }
    });
  }

  getLastNDaysLabels(n: number): string[] {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
      data: []
    }
  ];
  LikeRateLabels: string[] = ["Likes","Viewed"];
  LikeRateOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  updateLikeRateChart() {
    this.LikeRateData = [
      {
        label: 'Llied vs View',
        data: [this.favoris.length, this.vus.length]
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
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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


  
}
