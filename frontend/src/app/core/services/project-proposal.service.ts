import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectProposal, CreateProjectProposal, SuggestedTeam } from '../models/project-proposal.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectProposalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projectproposal`;

  getAll(): Observable<ProjectProposal[]> {
    return this.http.get<ProjectProposal[]>(this.apiUrl);
  }

  create(dto: CreateProjectProposal): Observable<ProjectProposal> {
    return this.http.post<ProjectProposal>(this.apiUrl, dto);
  }

  assembleTeam(id: number): Observable<SuggestedTeam> {
    return this.http.get<SuggestedTeam>(`${this.apiUrl}/${id}/assemble-team`);
  }
}
