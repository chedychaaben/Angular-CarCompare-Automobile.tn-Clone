import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Voiture } from 'src/Models/Voiture';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { MarqueService } from './marque.service';
import { CarrosserieService } from './carrosserie.service';

@Injectable({
  providedIn: 'root'
})
export class VoitureService {

  constructor(private http: HttpClient, 
    private marqueService: MarqueService,
    private carrosserieService: CarrosserieService) { }

    private enrichVoituresWithNames(voitures: Voiture[]): Observable<Voiture[]> {
      return forkJoin([
        this.marqueService.GetAllMarques(),
        this.carrosserieService.GetAllCarrosseries()
      ]).pipe(
        map(([marques, carrosseries]) => {
          return voitures.map(voiture => {
            const marque = marques.find(m => m.id === voiture.marque);
            const carrosserie = carrosseries.find(c => c.id === voiture.carrosserie);
            
            return {
              ...voiture,
              marque_nom: marque ? marque.nom : 'Unknown',
              carrosserie_nom: carrosserie ? carrosserie.nom : 'Unknown'
            };
          });
        })
      );
    }

    GetAllVoitures(): Observable<Voiture[]> {
      return this.http.get<Voiture[]>('http://localhost:3000/voitures').pipe(
        switchMap(voitures => this.enrichVoituresWithNames(voitures))
      );
    }

  AddVoiture(voiture: Voiture): Observable<void> {
    return this.http.post<void>('http://localhost:3000/voitures', voiture);
  }

  getLatestVoitures(): Observable<Voiture[]> {
    return this.http.get<Voiture[]>('http://localhost:3000/voitures').pipe(
      switchMap(voitures => {
        return this.enrichVoituresWithNames(voitures).pipe(
          map(enrichedVoitures => 
            enrichedVoitures.sort((a, b) => b.year - a.year).slice(0, 4)
          )
        );
      })
    );
  }

  getSimilarVoitures(voitureId: string): Observable<Voiture[]> {
    return this.http.get<Voiture[]>('http://localhost:3000/voitures').pipe(
      switchMap(voitures => {
        return this.enrichVoituresWithNames(voitures).pipe(
          map((enrichedVoitures: Voiture[]) => {
            const targetVoiture = enrichedVoitures.find(v => String(v.id) === String(voitureId));
            if (!targetVoiture) {
              return [];
            }
    
            let similarVoitures = enrichedVoitures.filter(v =>
              v.id !== voitureId &&
              (v.model === targetVoiture.model ||
               Math.abs(v.year - targetVoiture.year) <= 2 ||
               Math.abs(v.prix - targetVoiture.prix) <= 5000)
            );
    
            if (similarVoitures.length < 4) {
              const additionalVoitures = enrichedVoitures.filter(v => 
                v.id !== voitureId && !similarVoitures.includes(v)
              );
              similarVoitures = [...similarVoitures, ...additionalVoitures].slice(0, 4);
            }
    
            return similarVoitures.slice(0, 4);
          })
        );
      })
    );
  }

  getVoitureById(id: string): Observable<Voiture | null> {
    return this.http.get<Voiture>(`http://localhost:3000/voitures/${id}`).pipe(
      switchMap(voiture => {
        return this.enrichVoituresWithNames([voiture]).pipe(
          map(enrichedVoitures => enrichedVoitures[0]),
          catchError(err => {
            console.error('Voiture not found or error occurred:', err);
            return of(null);
          })
        );
      }),
      catchError(err => {
        console.error('Voiture not found or error occurred:', err);
        return of(null);
      })
    );
  }

  
  deleteVoiture(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/voitures/${id}`);
  }

}