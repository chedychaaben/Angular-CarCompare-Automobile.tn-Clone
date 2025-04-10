import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from 'src/Models/Role';
import { Auth, authState } from '@angular/fire/auth';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private userSubject = new BehaviorSubject<FirebaseUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  getUserId(): string | null {
    return this.userSubject.value?.uid || null;
  }

  getUserEmail(): string | null {
    return this.userSubject.value?.email || null;
  }

  // Add role to JSON Server
  AddRole(role: Role): Observable<void> {
    return this.http.post<void>('http://localhost:3000/roles', role);
  }

  // Get role by Firebase UID
  getRoleByUserId(uid: string): Observable<string> {
    return this.http.get<Role[]>(`http://localhost:3000/roles?uid=${uid}`).pipe(
      map((roles: Role[]) => roles.length > 0 ? roles[0].role : "")
    );
  }

  // Get user data with UID, email, and role
  getUserData(): Observable<{ uid: string, email: string, role: string } | undefined> {
    return new Observable(observer => {
      this.afAuth.user.subscribe(user => {
        if (user) {
          const uid = user.uid;
          const email = user.email || '';
          this.getRoleByUserId(uid).subscribe(fetchedRole => {
            observer.next({
              uid: uid,
              email: email,
              role: fetchedRole
            });
            observer.complete();
          });
        } else {
          observer.next(undefined);
          observer.complete();
        }
      });
    });
  }

  // Register new user and return user + role
  register(email: string, password: string, role: string): Observable<{ uid: string, email: string, role: string } | null> {
    return new Observable(observer => {
      this.afAuth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          if (user) {
            const roleData: Role = { uid: user.uid, role: role };
            this.AddRole(roleData).subscribe({
              next: () => {
                observer.next({
                  uid: user.uid,
                  email: user.email || '',
                  role: role
                });
                observer.complete();
              },
              error: error => {
                console.error("Error adding role:", error);
                observer.error(error);
              }
            });
          } else {
            observer.next(null);
            observer.complete();
          }
        })
        .catch(error => {
          console.error("Registration error:", error);
          observer.error(error);
        });
    });
  }


  // Login and return user + role
  login(email: string, password: string): Observable<{ uid: string, email: string, role: string } | null> {
    return new Observable(observer => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          if (user) {
            this.getRoleByUserId(user.uid).subscribe(role => {
              observer.next({
                uid: user.uid,
                email: user.email || '',
                role: role
              });
              observer.complete();
            });
          } else {
            observer.next(null);
            observer.complete();
          }
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // Logout
  logout() {
    this.afAuth.signOut();
  }

  isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }
}
