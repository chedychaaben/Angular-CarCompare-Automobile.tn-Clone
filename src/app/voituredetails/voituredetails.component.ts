import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VuService } from 'src/app/services/vu.service';
import { AuthService } from 'src/app/services/auth.service';
import { VoitureService } from 'src/app/services/voiture.service';
import { FavoriService } from 'src/app/services/favori.service';
import { Voiture } from 'src/Models/Voiture';
import { Vu } from 'src/Models/Vu';


type VoitureWithExtras = Voiture & {
  marque_nom?: string;
  carrosserie_nom?: string;
};


@Component({
  selector: 'app-voituredetails',
  templateUrl: './voituredetails.component.html',
  styleUrls: ['./voituredetails.component.css']
})
export class VoituredetailsComponent implements OnInit {
  voitureId: string = '';
  isLiked: boolean = false;
  MyVoiture!: VoitureWithExtras;
  similarVoitures: VoitureWithExtras[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public voitureService: VoitureService,
    private vuService: VuService,
    private favoriService: FavoriService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    // Subscribe to user data first
    this.authService.user$.subscribe(user => {
      if (user?.uid) {
        this.route.paramMap.subscribe(params => {
          this.voitureId = params.get('id') || '';
          if (!this.voitureId) {
            this.route.queryParamMap.subscribe(queryParams => {
              this.voitureId = queryParams.get('id') || '';
            });
          }

          if (this.voitureId) {
            // Check if the voiture exists
            this.voitureService.getVoitureById(this.voitureId).subscribe(voiture => {
              if (!voiture) {
                this.router.navigate(['/not-found']);
              } else {
                this.MyVoiture=voiture;
                const vuData: Vu = {
                  voitureid: this.voitureId,
                  userid: user.uid,
                  datetime: new Date()
                };

                this.vuService.AddVu(vuData).subscribe(() => {
                  console.log('Vu added successfully');
                });

                this.voitureService.getSimilarVoitures(this.voitureId).subscribe(voitures => {
                  this.similarVoitures = voitures;
                });

                // Check if the current voiture is liked by the user
                this.favoriService.getFavoriByUserAndCar(this.voitureId, user.uid).subscribe(existingFavori => {
                  this.isLiked = !!existingFavori;  // Set to true if favori exists
                });
              }
            }, err => {
              console.error('Error fetching voiture:', err);
              this.router.navigate(['/not-found']); // Redirect in case of error
            });
          }
        });
      }
    });
  }

  comparer() {
    this.router.navigate(['/comparer'], { queryParams: { voiture1: this.voitureId } });
  }

  LikeDislike() {
    this.favoriService.LikeDislike(this.voitureId).subscribe({
      next: () => {
        this.isLiked = !this.isLiked;  // Flip the like/dislike state
      },
      error: err => console.warn("Favori toggle failed:", err.message)
    });
  }
}
