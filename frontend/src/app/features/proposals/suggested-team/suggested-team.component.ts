import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SuggestedTeam } from '../../../core/models/project-proposal.model';
import { ProjectProposalService } from '../../../core/services/project-proposal.service';

@Component({
  selector: 'app-suggested-team',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './suggested-team.component.html'
})
export class SuggestedTeamComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private proposalService = inject(ProjectProposalService);

  suggestedTeam = signal<SuggestedTeam | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.proposalService.assembleTeam(id).subscribe({
      next: (data) => { this.suggestedTeam.set(data); this.isLoading.set(false); },
      error: () => { this.error.set('Failed to assemble team'); this.isLoading.set(false); }
    });
  }
}
