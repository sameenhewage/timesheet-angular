import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetRoutingModule } from './timesheet-routing.module';
import { TimesheetService } from '../services/timesheet.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, TimesheetRoutingModule],
  providers: [TimesheetService],
})
export class TimesheetModule {}
