import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TimeLogDTO } from '../../models/timeLog.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
  @Input({ required: true }) logData: TimeLogDTO[] = [];
}
