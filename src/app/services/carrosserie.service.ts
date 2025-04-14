import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrosserie } from 'src/Models/Carrosserie';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarrosserieService {

  constructor(private http: HttpClient) { }

  GetAllCarrosseries():Observable<Carrosserie[]>
  {
    return this.http.get<Carrosserie[]>('http://localhost:3000/carrosseries')
    
  }

  AddCarrosserie(carrosserie: Carrosserie): Observable<void> {
    return this.http.post<void>('http://localhost:3000/carrosseries', carrosserie);
  }


  getCarrosserieNomById(id: string): Observable<string> {
    return this.http.get<Carrosserie>(`http://localhost:3000/carrosseries/${id}`)
      .pipe(
        map(carrosserie => carrosserie.nom) // Extract 'nom' from the response
      );
  }

  deleteCarrosserie(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/carrosseries/${id}`);
  }
  
}