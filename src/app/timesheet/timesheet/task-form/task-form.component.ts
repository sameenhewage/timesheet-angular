import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  NgbDatepickerModule,
  NgbTypeaheadModule,
} from '@ng-bootstrap/ng-bootstrap';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { TimesheetService } from '../../services/timesheet.service';
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
  fb = inject(FormBuilder);

  timesheetService = inject(TimesheetService);

  @Input() searchTask!: (
    text$: Observable<string>
  ) => Observable<TaskTypeDTO[]>;

  @Output() onSubmitEvent = new EventEmitter();
  @Output() onSearchEmit = new EventEmitter();

  taskForm = this.fb.group({
    taskName: ['', [Validators.required]],
    startDate: [new Date(), [Validators.required]],
    endDate: [new Date(), [Validators.required]],
  });
  // Formatters for typeahead
  resultFormatter = (task: TaskTypeDTO) => (task ? task.name : '');
  inputFormatter = (task: TaskTypeDTO) => (task ? task.name : '');

  onSubmit() {
    let startDate: any = this.taskForm.controls['startDate'].value;
    let startDateObj = new Date(
      startDate?.year,
      startDate?.month - 1,
      startDate?.day
    );

    let endDate: any = this.taskForm.controls['endDate'].value;
    let endDateObj = new Date(endDate?.year, endDate?.month - 1, endDate?.day);
    console.log(this.taskForm.value);

    let taskName = this.taskForm.controls['taskName'].value;

    const data = {
      startDate: startDateObj,
      endDate: endDateObj,
      task: taskName,
    };

    this.onSubmitEvent.emit(data);
  }
}
