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
    startDate: Date;
    endDate: Date;
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
    // get date values
    const startStruct = this.startDate.value as NgbDateStruct | null;
    const endStruct = this.endDate.value as NgbDateStruct | null;

    if (!startStruct || !endStruct) {
      // show error or stop submit
      return;
    }

    const startDateObj = new Date(
      startStruct.year,
      startStruct.month - 1,
      startStruct.day
    );
    const endDateObj = new Date(
      endStruct.year,
      endStruct.month - 1,
      endStruct.day
    );

    // get task
    const task = this.taskName.value as TaskTypeDTO;

    const data = {
      startDate: startDateObj,
      endDate: endDateObj,
      task: task?.name || '',
    };

    this.onSubmitEvent.emit(data);

    this.taskForm.reset();
  }
}
