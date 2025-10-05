import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgbCalendar,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbTypeaheadModule,
  NgbTimepicker,
} from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { TaskTypeDTO } from '../../models/taskType.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbTypeaheadModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  /**
   * The input for the typeahead component.
   * It expects an observable of strings and returns an observable of TaskTypeDTOs.
   * The typeahead component will display the name of the task type.
   */
  @Input() searchTask!: (
    text$: Observable<string>
  ) => Observable<TaskTypeDTO[]>;

  /**
   * The event emitted when the form is submitted.
   * It contains the date and task data.
   */
  @Output() onSubmitEvent = new EventEmitter<{
    startDate: string;
    endDate: string;
    task: string;
  }>();

  /**
   * The event emitted when the search input changes.
   * It contains the search string.
   */
  @Output() onSearchEmit = new EventEmitter<string>();

  private _fb = inject(FormBuilder);

  private _calender = inject(NgbCalendar);

  /**
   * The current date.
   */
  today = this._calender.getToday();

  /**
   * The form group.
   */
  taskForm = this._fb.group({
    taskName: ['', [Validators.required]],
    startDate: [null, [Validators.required]],
    endDate: [null, [Validators.required]],
  });

  /**
   * The formatter for the typeahead.
   * It returns the name of the task type.
   */
  resultFormatter = (task: TaskTypeDTO) => (task ? task.name : '');

  /**
   * The input formatter for the typeahead.
   * It returns the name of the task type.
   */
  inputFormatter = (task: TaskTypeDTO) => (task ? task.name : '');

  /**
   * The constructor.
   */
  constructor() {}

  /**
   * Gets the task name control.
   * @returns The task name control.
   */
  get taskName(): FormControl {
    return this.taskForm.get('taskName') as FormControl;
  }

  /**
   * Gets the start date control.
   * @returns The start date control.
   */
  get startDate(): FormControl {
    return this.taskForm.get('startDate') as FormControl;
  }

  /**
   * Gets the end date control.
   * @returns The end date control.
   */
  get endDate(): FormControl {
    return this.taskForm.get('endDate') as FormControl;
  }

  /**
   * Submits the form.
   */
  onSubmit() {
    const { taskName, startDate, endDate }: any = this.taskForm.value;

    if (!startDate || !endDate) {
      return;
    }

    const now = new Date();

    // Set start date with the selected day but current time (hours, minutes, seconds)
    const task_startDate = new Date(
      startDate.year,
      startDate.month - 1,
      startDate.day,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    // Set end date with the selected day and same time as start date
    // This ensures both start and end times are aligned with current time
    const task_endDate = new Date(
      endDate.year,
      endDate.month - 1,
      endDate.day,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    const data = {
      task: taskName?.name,
      startDate: task_startDate.toISOString(),
      endDate: task_endDate.toISOString(),
    };

    this.onSubmitEvent.emit(data);

    this.taskForm.reset();
  }
}
