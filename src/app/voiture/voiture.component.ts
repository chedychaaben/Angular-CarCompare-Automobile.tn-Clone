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
    'transmission', 'horsepower', 'topspeed', 'acceleration', 'actions'
  ];
  dataSource: Voiture[] = [];

  constructor(private voitureService: VoitureService) {}

  ngOnInit() {
    this.voitureService.GetAllVoitures().subscribe((data) => {
      console.log(data);
      this.dataSource = data;
    });
  }

  deleteVoiture(id: string) {
    if (confirm("Voulez-vous vraiment supprimer cette Voiture ?")) {
      this.voitureService.deleteVoiture(id).subscribe(() => {
        this.getVoitures();
      });
    }
  }
  
  getVoitures() {
    this.voitureService.GetAllVoitures().subscribe(data => {
      this.dataSource = data;
      console.log(data);
    });
  }
}
