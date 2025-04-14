import { Component, OnInit } from '@angular/core';
import { Carrosserie } from 'src/Models/Carrosserie';
import { CarrosserieService } from '../services/carrosserie.service';

@Component({
  selector: 'app-carrosserie',
  templateUrl: './carrosserie.component.html',
  styleUrls: ['./carrosserie.component.css']
})
export class CarrosserieComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'image', 'actions'];
  dataSource: Carrosserie[] = [];

  constructor(private carrosserieService: CarrosserieService) {}

  ngOnInit() {
    this.carrosserieService.GetAllCarrosseries().subscribe((data) => {
      console.log(data);
      this.dataSource = data;
    });
  }

  deleteCarrosserie(id: string) {
    if (confirm("Voulez-vous vraiment supprimer cette carrosserie ?")) {
      this.carrosserieService.deleteCarrosserie(id).subscribe(() => {
        this.getCarrosseries();
      });
    }
  }
  
  getCarrosseries() {
    this.carrosserieService.GetAllCarrosseries().subscribe(data => {
      this.dataSource = data;
    });
  }
}