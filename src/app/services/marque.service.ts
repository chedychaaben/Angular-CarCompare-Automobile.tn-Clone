import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marque } from 'src/Models/Marque';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MarqueService {

  constructor(private http: HttpClient) { }

  GetAllMarques():Observable<Marque[]>
  {
    return this.http.get<Marque[]>('http://localhost:3000/marques')
    
  }

  AddMarque(marque: Marque): Observable<void> {
    return this.http.post<void>('http://localhost:3000/marques', marque);
  }

}
