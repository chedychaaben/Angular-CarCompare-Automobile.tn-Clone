import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VuService } from 'src/app/services/vu.service';
import { VoitureService } from 'src/app/services/voiture.service';
import { FavoriService } from 'src/app/services/favori.service';
import { Voiture } from 'src/Models/Voiture';
import { Vu } from 'src/Models/Vu';
import { Favori } from 'src/Models/Favori';

@Component({
  selector: 'app-voituredetails',
  templateUrl: './voituredetails.component.html',
  styleUrls: ['./voituredetails.component.css']
})
export class VoituredetailsComponent implements OnInit {
  voitureId: string | null = null;
  similarVoitures: Voiture[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private voitureService: VoitureService,
    private vuService: VuService,
    private favoriService: FavoriService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.voitureId = params.get('id');
      
      if (!this.voitureId) {
        this.route.queryParamMap.subscribe(queryParams => {
          this.voitureId = queryParams.get('id');
        });
      }
  
      if (this.voitureId) {
        const vuData: Vu = {
          voitureid: this.voitureId,
          userid: '', // User ID is null for now
          datetime: new Date()
        };
  
        this.vuService.AddVu(vuData).subscribe(() => {
          console.log('Vu added successfully');
        });
  
        this.voitureService.getSimilarVoitures(this.voitureId).subscribe(voitures => {
          this.similarVoitures = voitures;
        });
      }
    });
  }

  
  comparer() {
    this.router.navigate(['/comparer'], { queryParams: { voiture1: this.voitureId } });
  }

  ajouterFavori() {
    if(this.voitureId)
    {
    this.favoriService.AddFavori(this.voitureId).subscribe(() => {
      console.log('Favori added successfully');
    });
    }
    
  }


}
