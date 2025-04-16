import { Component } from '@angular/core';
import { ChartType, ChartOptions, registerables } from 'chart.js';  // <-- Registerables import

// Register all the required Chart.js components
import { Chart } from 'chart.js';
Chart.register(...registerables);  // <-- Register all components, including "bar"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public chartData = {
    labels: ['Car A', 'Car B', 'Car C'],
    datasets: [
      {
        label: 'Horsepower',
        data: [150, 200, 180],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  };

  // Correct type for options using Chart.js v4.x.x
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  public chartType: ChartType = 'bar';
}
