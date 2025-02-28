import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import {Router} from "@angular/router";
import {environment} from "../environments/environment";

interface DecodedToken {
  id: number;
  role: string;
  permissions: string[];
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.api}/api/auth`;
  private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginStatusChanged = this.loginStatus.asObservable();

  constructor(private http: HttpClient, private router : Router) {}


  isLoggedIn(): boolean {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      return true;
    }
    this.logout();
    return false;
  }


  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/auth/login`, credentials, { headers }).pipe(
        tap((response: any) => {
          const token = response?.data?.token;
          if (response.success && token) {
            localStorage.setItem('token', token);
            this.loginStatus.next(true);
          }
        }),
        catchError((error) => {
          console.error('Greška prilikom prijave:', error);
          return throwError(() => new Error('Neuspešna prijava. Proverite email i lozinku.'));
        })
    );
  }


  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).pipe(
        tap(() => {
         this.router.navigate(['/']).then(r => localStorage.removeItem('token'));
          this.loginStatus.next(false);
        }),
        catchError((error) => {
          console.error('Greška prilikom odjave:', error);
          return throwError(() => new Error('Neuspešna odjava.'));
        })
    );
  }


  resetPassword(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.apiUrl}/users/reset-password/`, { email }, { headers }).pipe(
        tap(() => console.log('Email za reset lozinke poslat.')),
        catchError((error) => {
          console.error('Greška prilikom resetovanja lozinke:', error);
          return throwError(() => new Error('Neuspešno resetovanje lozinke.'));
        })
    );
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Parsiranje JWT tokena
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode<DecodedToken>(token);
      } catch (error) {
        console.error('Neuspešno parsiranje JWT tokena:', error);
        return null;
      }
    }
    return null;
  }

  getUserId(): number | null {
    return this.getDecodedToken()?.id ?? null;
  }

  getUserRole(): string | null {
    return this.getDecodedToken()?.role ?? null;
  }

  getUserPermissions(): string[] {
    return this.getDecodedToken()?.permissions ?? [];
  }

  isTokenExpired(): boolean {
    const decoded = this.getDecodedToken();
    if (decoded?.exp) {
      const expirationDate = new Date(decoded.exp * 1000);
      const now = new Date();
      return expirationDate < now;
    }
    return true;
  }


  changePassword(data: { password: any; token: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/users/reset-password/`, data, { headers }).pipe(
        tap(() => console.log('Zahtev za promenu lozinke uspešno poslat.')),
        catchError((error) => {
          console.error('Greška prilikom slanja zahteva za promenu lozinke:', error);
          return throwError(() => new Error('Neuspešna promena lozinke.'));
        })
    );
  }

}
