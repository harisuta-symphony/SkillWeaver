import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
  private employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.employeeService.getAll().subscribe({
      next: (data) => { this.employees.set(data); this.isLoading.set(false); },
      error: (err) => { this.error.set('Failed to load employees'); this.isLoading.set(false); }
    });
  }
}