import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Voiture } from 'src/Models/Voiture';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {

  constructor(private http: HttpClient) { }

  GetAllVoitures():Observable<Voiture[]>
  {
    return this.http.get<Voiture[]>('http://localhost:3000/voitures')
    
  }

  AddVoiture(voiture: Voiture): Observable<void> {
    return this.http.post<void>('http://localhost:3000/voitures', voiture);
  }

  getLatestVoitures(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>('http://localhost:3000/voitures').pipe(
      map((voitures: Voiture[]) =>
        voitures.sort((a, b) => b.year - a.year).slice(0, 4)
      )
    );
  }

  getSimilarVoitures(voitureId: string): Observable<Voiture[]> {
    return this.http.get<Voiture[]>('http://localhost:3000/voitures').pipe(
      map((voitures: Voiture[]) => {
  
        const targetVoiture = voitures.find(v => String(v.id) === String(voitureId));
        if (!targetVoiture) {
          return [];
        }
  
        let similarVoitures = voitures.filter(v =>
          v.id !== voitureId &&
          (v.model === targetVoiture.model ||
           Math.abs(v.year - targetVoiture.year) <= 2 ||
           Math.abs(v.prix - targetVoiture.prix) <= 5000)
        );
  
  
        if (similarVoitures.length < 4) {
          const additionalVoitures = voitures.filter(v => v.id !== voitureId && !similarVoitures.includes(v));
          similarVoitures = [...similarVoitures, ...additionalVoitures].slice(0, 4);
        }
  
        return similarVoitures.slice(0, 4);
      })
    );
  }

}