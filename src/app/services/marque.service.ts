import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Marque } from 'src/Models/Marque';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


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

  getMarqueNomById(id: string): Observable<string> {
    return this.http.get<Marque>(`http://localhost:3000/marques/${id}`)
      .pipe(
        map(marque => marque.nom)
      );
  }

  
  deleteMarque(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/marques/${id}`);
  }
}
