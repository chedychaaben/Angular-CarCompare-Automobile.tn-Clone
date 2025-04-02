import { Injectable } from '@angular/core';
import { Comparison } from 'src/Models/Comparison';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompareService {

  constructor(private http: HttpClient) { }

  GetAllComparisons():Observable<Comparison[]>
  {
    return this.http.get<Comparison[]>('http://localhost:3000/comparisons')
    
  }

  AddComparison(comparison: Comparison): Observable<void> {
    return this.http.post<void>('http://localhost:3000/comparisons', comparison);
  }

}