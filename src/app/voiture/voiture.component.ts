import { Component, OnInit } from '@angular/core';
import { Voiture } from 'src/Models/Voiture';
import { VoitureService } from '../services/voiture.service';

@Component({
  selector: 'app-voiture',
  templateUrl: './voiture.component.html',
  styleUrls: ['./voiture.component.css']
})
export class VoitureComponent implements OnInit {
  displayedColumns: string[] = [
    'marque', 'model', 'carrosserie', 'moteur', 'prix', 'image',
    'nbports', 'nbchaises', 'year', 'drivetrain', 'fuel',
    'transmission', 'horsepower', 'topspeed', 'acceleration'
  ];
  dataSource: Voiture[] = [];

  constructor(private voitureService: VoitureService) {}

  ngOnInit() {
    this.voitureService.GetAllVoitures().subscribe((data) => {
      console.log(data);
      this.dataSource = data;
    });
  }
}
