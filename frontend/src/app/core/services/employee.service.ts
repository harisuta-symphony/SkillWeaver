import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee, CreateEmployee } from '../models/employee.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/employee`;

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateEmployee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, dto);
  }

  updateCapacity(id: number, capacityPercentage: number): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/${id}/capacity`, { capacityPercentage });
  }

  assignSkill(id: number, skillId: number, proficiency: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/skills`, { skillId, proficiency });
  }
}
