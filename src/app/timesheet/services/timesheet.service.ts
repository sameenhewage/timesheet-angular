import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private _httpClient = inject(HttpClient);
  private _baseUrl = environment.baseUrl + '/tasktype';

  taskDataError = {
    message: '',
    statusCode: 0,
  };

  getTaskData(): Observable<any> {
    return this._httpClient.get<any>(`${this._baseUrl}`).pipe(
      catchError((error) => {
        this.taskDataError.message = error.message;
        this.taskDataError.statusCode = error.status;
        return of([]);
      })
    );
  }

  saveTaskData(data: any): Observable<any> {
    return this._httpClient.post<any>(`${this._baseUrl}`, data).pipe(
      catchError((error) => {
        this.taskDataError.message = error.message;
        this.taskDataError.statusCode = error.status;
        return of([]);
      })
    );
  }

  constructor() {}
}
