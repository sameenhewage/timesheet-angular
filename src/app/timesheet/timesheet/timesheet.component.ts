import { Component, inject, OnInit } from '@angular/core';
import { TaskFormComponent } from './task-form/task-form.component';
import { TimesheetService } from '../services/timesheet.service';
import { CommonModule } from '@angular/common';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [TaskFormComponent, CommonModule, TaskListComponent],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.scss',
})
export class TimesheetComponent {
  private _timeSheetService = inject(TimesheetService);

  logData$ = this._timeSheetService.getLogData();

  taskDataError = this._timeSheetService.taskDataError;

  isLoading$ = this._timeSheetService.isLoading$;

  searchTask = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => {
        return term.length < 1
          ? of([])
          : this._timeSheetService.getTaskData(term);
      })
    );

  /**
   * Submits a new time log to the API and updates the observable containing the list of time logs.
   * @param {any} event The event containing the new time log data.
   */
  onSubmit(event: any) {
    const data: any = {
      startDate: event.startDate,
      endDate: event.endDate,
      task: event.task,
    };

    this._timeSheetService
      .saveTaskData(data)
      .pipe(
        switchMap(() => this._timeSheetService.getLogData()), // get updated logs
        tap((logs) => {
          this.logData$ = of(logs); // <-- update observable
        })
      )
      .subscribe();
  }
}
