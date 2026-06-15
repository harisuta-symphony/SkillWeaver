import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Skill } from '../../../core/models/skill.model';
import { SkillService } from '../../../core/services/skill.service';
import { ProjectProposalService } from '../../../core/services/project-proposal.service';

@Component({
  selector: 'app-proposal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proposal-form.component.html'
})
export class ProposalFormComponent implements OnInit {
  private skillService = inject(SkillService);
  private proposalService = inject(ProjectProposalService);
  private router = inject(Router);

  availableSkills = signal<Skill[]>([]);
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  title = '';
  description = '';
  requiredCommitmentPercentage = 30;

  requiredSkills = signal<{ skillId: number; skillName: string; minimumProficiency: string }[]>([]);

  selectedSkillId = 0;
  selectedProficiency = 'Intermediate';
  readonly proficiencies = ['Beginner', 'Intermediate', 'Expert'];

  ngOnInit() {
    this.skillService.getAll().subscribe({
      next: (data) => this.availableSkills.set(data),
      error: () => this.error.set('Failed to load skills')
    });
  }

  addSkill() {
    if (!this.selectedSkillId) return;

    const skill = this.availableSkills().find(s => s.id === Number(this.selectedSkillId));
    if (!skill) return;

    const alreadyAdded = this.requiredSkills().some(s => s.skillId === skill.id);
    if (alreadyAdded) return;

    this.requiredSkills.update(current => [
      ...current,
      { skillId: skill.id, skillName: skill.name, minimumProficiency: this.selectedProficiency }
    ]);

    this.selectedSkillId = 0;
    this.selectedProficiency = 'Intermediate';
  }

  removeSkill(skillId: number) {
    this.requiredSkills.update(current => current.filter(s => s.skillId !== skillId));
  }

  submit() {
    if (!this.title.trim() || this.requiredSkills().length === 0) return;

    this.isSubmitting.set(true);
    this.error.set(null);

    this.proposalService.create({
      title: this.title.trim(),
      description: this.description.trim() || undefined,
      requiredCommitmentPercentage: this.requiredCommitmentPercentage,
      requiredSkills: this.requiredSkills().map(s => ({
        skillId: s.skillId,
        minimumProficiency: s.minimumProficiency
      }))
    }).subscribe({
      next: (proposal) => this.router.navigate(['/proposals', proposal.id, 'team']),
      error: () => { this.error.set('Failed to create proposal'); this.isSubmitting.set(false); }
    });
  }
}
