import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { map, switchMap, Observable, of } from 'rxjs';

const API_URL = 'http://localhost:3000/roles'; // JSON server URL

export const authGuard = (requiredRole?: string): Observable<boolean> => {
  const afAuth = inject(AngularFireAuth);
  const http = inject(HttpClient);
  const router = inject(Router);

  return afAuth.authState.pipe(
    switchMap(user => {
      if (!user) {
        router.navigate(['/login']);
        return of(false);
      }

      return http.get<any[]>(`${API_URL}?uid=${user.uid}`).pipe(
        map(roles => {
          const userRole = roles.length ? roles[0].role : null;

          if (requiredRole) {
            if (userRole === requiredRole) {
              return true; // Allowed
            } else {
              router.navigate(['/login']); // Redirect if no permission
              return false;
            }
          }

          return true; // Allow access if no specific role is required
        })
      );
    })
  );
};
