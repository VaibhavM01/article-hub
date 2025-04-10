import { Injectable, signal,Injector, inject,runInInjectionContext } from '@angular/core';
import { Auth, authState,onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { FirestoreService } from './firestore/firestore.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  private user = signal<User | null>(null);
  private injector = inject(Injector);
  constructor(private firestoreService: FirestoreService) {
    runInInjectionContext(this.injector, () => {
      onAuthStateChanged(this.auth, (u) => {
        this.user.set(u);
      });
    });  
  }

  loginWithGoogle(): Observable<User> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider).then(cred => {
      const user = cred.user;
      this.firestoreService.saveUserProfile({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        cretatedAt: new Date().toISOString(),
        photoURL: user.photoURL
      });
      return user;
    }));
  }

  loginWithEmail(email: string, password: string): Observable<User> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then(cred => cred.user)
    );
  }

  registerWithEmail(email: string, password: string, displayName: string): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async cred => {
        const user = cred.user;
        await this.firestoreService.saveUserProfile({
          uid: user.uid,
          displayName,
          email: user.email,
          cretatedAt: new Date().toISOString()
        });
        return user;
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.user();
  }
 
  logout() {
    return signOut(this.auth);
  }

  getCurrentUser() {
    return this.user();
  }
}
