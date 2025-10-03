import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { start } from '@popperjs/core';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  fb = inject(FormBuilder);

  @Input() tasks!: any;
  @Output() onSubmitEvent = new EventEmitter();

  taskForm = this.fb.group({
    task: ['', [Validators.required]],
    start: [new Date(), [Validators.required]],
    end: ['', [Validators.required]],
  });

  onSubmit() {
    // let startDateTemp = new Date(startDate.year)
    let startDate: any = this.taskForm.controls['start'].value;
    let startDateObj = new Date(
      startDate?.year,
      startDate?.month - 1,
      startDate?.day
    );

    let endDate: any = this.taskForm.controls['end'].value;
    let endDateObj = new Date(endDate?.year, endDate?.month - 1, endDate?.day);
    console.log(this.taskForm.value);

    let taskName = this.taskForm.controls['task'].value;

    const data = {
      startDate: startDateObj,
      endDate: endDateObj,
      task: taskName,
    };

    this.onSubmitEvent.emit(data);
  }
}
