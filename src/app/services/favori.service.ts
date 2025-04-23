import { Injectable } from '@angular/core';
import { Observable, switchMap, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Favori } from 'src/Models/Favori';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  GetAllFavoris(): Observable<Favori[]> {
    return this.http.get<Favori[]>('http://localhost:3000/favoris');
  }

  getIfCarIsLiked(voitureId: string, userId: string): Observable<boolean> {
    return this.http.get<Favori[]>('http://localhost:3000/favoris').pipe(
      map(favoris => favoris.some(favori => favori.voitureid === voitureId && favori.userid === userId))
    );
  }
  
  getFavoriByUserAndCar(voitureId: string, userId: string): Observable<Favori | null> {
    return this.http.get<Favori[]>(`http://localhost:3000/favoris`).pipe(
      map(favoris => favoris.find(favori => favori.voitureid === voitureId && favori.userid === userId) || null)
    );
  }
  
  LikeDislike(voitureid: string): Observable<void> {
    return this.authService.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user?.uid) {
          throw new Error('User not authenticated');
        }
  
        // Check if the voiture is already liked by the user
        return this.getFavoriByUserAndCar(voitureid, user.uid).pipe(
          switchMap(existingFavori => {
            if (existingFavori) {
              // If the voiture is already liked, remove it (dislike)
              return this.http.delete<void>(`http://localhost:3000/favoris/${existingFavori.id}`);
            } else {
              // If not liked, add it (like)
              const newFavori: Favori = {
                voitureid,
                userid: user.uid,
                datetime: new Date()
              };
              return this.http.post<void>('http://localhost:3000/favoris', newFavori);
            }
          })
        );
      })
    );
  }


  GetFavorisByUserId(userId: string): Observable<Favori[]> {
    return this.http.get<Favori[]>(`http://localhost:3000/favoris?userid=${userId}`);
  }
  
}
