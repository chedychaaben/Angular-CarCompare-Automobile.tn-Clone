import { Component, OnInit } from '@angular/core';
import { Carrosserie } from 'src/Models/Carrosserie';
import { CarrosserieService } from '../services/carrosserie.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CarrosserieEditModalComponent } from "src/app/carrosserie-edit-modal/carrosserie-edit-modal.component";

@Component({
  selector: 'app-carrosserie',
  templateUrl: './carrosserie.component.html',
  styleUrls: ['./carrosserie.component.css']
})
export class CarrosserieComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'image', 'actions'];
  dataSource: Carrosserie[] = [];

  constructor(private carrosserieService: CarrosserieService, private dialog:MatDialog) {}

  ngOnInit() {
    this.carrosserieService.GetAllCarrosseries().subscribe((data) => {
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


  openedit(id: string) {
    const dialogConfig = new MatDialogConfig();
  
    // Fetch the Carrosserie data based on the id
    this.carrosserieService.getCarrosserieById(id).subscribe((carrosserieRecupere) => {
  
      dialogConfig.data = {
        id: id,
        carrosserie: carrosserieRecupere
      };
  
      const dialogRef = this.dialog.open(CarrosserieEditModalComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          console.log("Editing completed.");
          this.getCarrosseries();
        }
      });
    });
  }

}