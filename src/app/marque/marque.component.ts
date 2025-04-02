import { Component, OnInit } from '@angular/core';
import { Marque } from 'src/Models/Marque';
import { MarqueService } from '../services/marque.service';

@Component({
  selector: 'app-marque',
  templateUrl: './marque.component.html',
  styleUrls: ['./marque.component.css']
})
export class MarqueComponent implements OnInit{
  displayedColumns: string[] = ['id', 'nom', 'pays', 'logo'];
  dataSource: Marque[] = [];
  
  constructor(private marqueService:MarqueService){}
    ngOnInit(){
      this.marqueService.GetAllMarques().subscribe( (data) => {
        // action
        console.log(data)
        this.dataSource = data
      })
    }

}
