import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map, Observable, throwError} from 'rxjs';
import {environment} from "../environments/environment";
//import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';
import {AuthService} from "./auth.service";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private aiUrl = `${environment.api}/api/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createEmployee(employeeData: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.post(`http://localhost:8080/api/users/employees/`, employeeData, { headers });

  }

  createCustomer(customerData: any): Observable<any> {
    const token= this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.post(`http://localhost:8080/api/customer`, customerData, { headers });

  }


  fetchEmployees(): Observable<{ employees: Employee[]; total: number }> {
    const token = this.authService.getToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.get<{ success: boolean; data: { rows: Employee[]; total: number } }>(`${this.aiUrl}/search/employees`, { headers }
    ).pipe(
      map(response => ({
        employees: response.data.rows,
        total: response.data.total
      })),
      catchError((error) => {
        console.error('Greška prilikom prikazivanja:', error);
        return throwError(() => new Error('Neuspešno.'));
      })
    );
  }


  fetchCustomers(): Observable<{ customers: Customer[]; total: number }> {
    const token = this.authService.getToken()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.get<{ success: boolean; data: { rows: Customer[]; total: number } }>(`${this.aiUrl}/search/customers`, { headers }
    ).pipe(
      map(response => ({
        customers: response.data.rows,
        total: response.data.total
      })),
      catchError((error) => {
        console.error('Greška prilikom prikazivanja:', error);
        return throwError(() => new Error('Neuspešno.'));
      })
    );
  }

  deleteEmployee(id: number): Observable<void> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.delete<void>(`${this.aiUrl}/search/employee${id}`, { headers });
  }

  deleteCustumer(id: number): Observable<void> {
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.delete<void>(`${this.aiUrl}/search/customer${id}`, { headers });
  }

  updateEmployee(id: number, employeeData: Partial<Employee>): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });


    return this.http.put<void>(`${this.aiUrl}/employees/${id}`, employeeData, { headers });
  }

  updateCustomer(id: number, customerData: Partial<Customer>): Observable<void> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`http://localhost:8080/api/customer/${id}`, customerData, { headers });
  }

  updateEmployeePermissions(id: number, permissions: string[]): Observable<void> {
    const body = { permissions };
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`${this.aiUrl}/search/employee/${id}/permissions`, body, { headers });
  }

  updateCustomerPermissions(id: number, permissions: string[]): Observable<void> {
    const body = { permissions };
    const token = ''; //this.authService.getToken(); //cekam auth
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<void>(`${this.aiUrl}/search/customer/${id}/permissions`, body, { headers });
  }




}


export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  povezaniRacuni: string[];
  pozicija: null;
  aktivan: null;
  permissions: string[];
}


export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: number;
  gender: string;
  email: string;
  phoneNumber: string;
  address: string;
  username: string;
  position: string;
  department: string;
  isAdmin:boolean;
  active: boolean;
  permissions: string[];
}

