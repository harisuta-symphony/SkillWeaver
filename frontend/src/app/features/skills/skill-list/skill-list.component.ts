import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '../../../core/models/skill.model';
import { SkillService } from '../../../core/services/skill.service';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skill-list.component.html'
})
export class SkillListComponent implements OnInit {
  private skillService = inject(SkillService);

  skills = signal<Skill[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.skillService.getAll().subscribe({
      next: (data) => { this.skills.set(data); this.isLoading.set(false); },
      error: (err) => { this.error.set('Failed to load skills'); this.isLoading.set(false); }
    });
  }
}
