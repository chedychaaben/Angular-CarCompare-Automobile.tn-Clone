import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Pie chart data
  public pieChartLabels: string[] = ['Sales', 'Marketing', 'Development'];
  public pieChartData: number[] = [120, 150, 180];
  public pieChartType: string = 'pie';
  public pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };
}
