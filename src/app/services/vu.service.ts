import { Injectable } from '@angular/core';
import { Vu } from 'src/Models/Vu';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VuService {

  constructor(private http: HttpClient) { }

  GetAllVus(): Observable<Vu[]> {
    return this.http.get<Vu[]>('http://localhost:3000/vus');
  }

  AddVu(vu: Vu): Observable<void> {
    return this.http.post<void>('http://localhost:3000/vus', vu);
  }

  GetVusByUserId(userId: string): Observable<Vu[]> {
    return this.http.get<Vu[]>(`http://localhost:3000/vus?userId=${userId}`);
  }

}
