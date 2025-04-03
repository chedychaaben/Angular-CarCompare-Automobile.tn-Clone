import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Favori } from 'src/Models/Favori';

@Injectable({
  providedIn: 'root'
})
export class FavoriService {

  constructor(private http: HttpClient) {}

  GetAllFavoris(): Observable<Favori[]> {
    return this.http.get<Favori[]>('http://localhost:3000/favoris');
  }

  AddFavori(voitureid: string): Observable<void> {
    const newFavori: Favori = {
      voitureid,
      userid: '',
      datetime: new Date()
    };
    return this.http.post<void>('http://localhost:3000/favoris', newFavori);
  }
}
