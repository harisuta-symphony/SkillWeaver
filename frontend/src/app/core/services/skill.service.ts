import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../models/skill.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/skill`;

  getAll(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl);
  }
}