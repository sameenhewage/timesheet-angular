import { Component, inject } from '@angular/core';
import { TaskFormComponent } from './task-form/task-form.component';
import { TimesheetService } from '../services/timesheet.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [TaskFormComponent, CommonModule],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
})
export class TimesheetComponent {
  timeSheetService = inject(TimesheetService);

  taskData = this.timeSheetService.getTaskData();

  onSubmit(event: any) {
    console.log(event);

    const data = {
      startDate: event.startDate,
      endDate: event.endDate,
      task: event.task,
    };

    this.timeSheetService.saveTaskData(data).subscribe((res) => {
      console.log(res);
    });
  }
}
