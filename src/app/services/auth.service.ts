import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from 'src/Models/Role';
import { User } from 'src/Models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //user$: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {}


  // Observable method to add role of user to JSON Server
  AddRole(role: Role): Observable<void> {
    return this.http.post<void>('http://localhost:3000/roles', role);
  }

  getRoleByUserId(uid: string): Observable<string> {
    return this.http.get<Role[]>(`http://localhost:3000/roles?uid=${uid}`).pipe(
      map((roles: Role[]) => roles.length > 0 ? roles[0].role : "")
    );
  }

  getUserData(): Observable<User | undefined> {
    let uid: string = '';
    let email: string = '';
    let role: string = ''; // Use string primitive type here
  
    return new Observable<User | undefined>(observer => {
      this.afAuth.user.subscribe(user => {
        if (user) {
          uid = user.uid;
          email = user.email || '';
          this.getRoleByUserId(uid).subscribe(fetchedRole => {
            role = fetchedRole; // Update role from the fetched value
            // Now we return the User object with updated role
            observer.next({
              uid: uid,
              email: email,
              role: role
            });
            observer.complete();
          });
        } else {
          observer.next(undefined); // No user, so return undefined
          observer.complete();
        }
      });
    });
  }
  

  // Register a new user in Firebase and their role to JSON Server
  async register(email: string, password: string, role: string) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Store user data in JSON Server
        const roleData = { uid: user.uid, role: role };

        // Subscribe to the observable instead of using toPromise()
        this.AddRole(roleData).subscribe({
          next: () => {
            console.log("User registered successfully:", user, "with roles data", roleData);
          },
          error: (error) => {
            console.error("Error adding user to JSON Server:", error);
          }
        });
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  }


  login(email: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.afAuth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          if (user) {
            // Directly return the user data and role in one go
            this.getRoleByUserId(user.uid).subscribe(role => {
              observer.next({ uid: user.uid, email: user.email, role: role });
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


  logout() {
    this.afAuth.signOut();
  }

}
