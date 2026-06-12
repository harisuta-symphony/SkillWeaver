import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  {
    path: 'employees',
    loadComponent: () => import('./features/employees/employee-list/employee-list.component')
      .then(m => m.EmployeeListComponent)
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/skills/skill-list/skill-list.component')
      .then(m => m.SkillListComponent)
  },
  {
    path: 'proposals',
    loadComponent: () => import('./features/proposals/proposal-form/proposal-form.component')
      .then(m => m.ProposalFormComponent)
  },
  {
    path: 'proposals/:id/team',
    loadComponent: () => import('./features/proposals/suggested-team/suggested-team.component')
      .then(m => m.SuggestedTeamComponent)
  }
];