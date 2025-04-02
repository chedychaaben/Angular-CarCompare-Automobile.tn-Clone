import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Carrosserie } from 'src/Models/Carrosserie';
import { HttpClient } from '@angular/common/http';

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

}