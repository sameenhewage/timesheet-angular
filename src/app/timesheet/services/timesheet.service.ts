import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  EMPTY,
  finalize,
  map,
  Observable,
  ObservedValueOf,
  of,
  startWith,
  tap,
  shareReplay,
  switchMap,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { TimeLogDTO } from '../models/timeLog.model';
import { TaskTypeDTO } from '../models/taskType.model';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private _httpClient = inject(HttpClient);
  private _baseUrlTaskType = environment.baseUrl + '/tasktype';
  private _baseUrlLog = environment.baseUrl + '/log';

  private _refreshTrigger$ = new BehaviorSubject<void>(undefined);

  taskDataError = {
    message: '',
    statusCode: 0,
  };

  isLoading$ = new BehaviorSubject<boolean>(false);

  /**
   * An observable containing an array of time logs.
   * Triggered by `_refreshTrigger$` and fetches data from the API.
   * Populates `taskDataError` on error and manages loading state.
   * @returns {Observable<TimeLogDTO[]>} An observable containing an array of time logs.
   */
  public logData$ = this._refreshTrigger$.pipe(
    // Fetch time logs when `_refreshTrigger$` emits
    switchMap(() => {
      return this._httpClient.get<TimeLogDTO[]>(`${this._baseUrlLog}`).pipe(
        tap(() => this.isLoading$.next(true)),
        catchError((error) => {
          this.taskDataError.message = error.message;
          this.taskDataError.statusCode = error.status;
          return of([]); //return empty array on error
        }),
        finalize(() => this.isLoading$.next(false)) // Set loading false when done
      );
    }),
    // Share the observable and replay the latest value
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor() {}

  refreshLogData(): void {
    this._refreshTrigger$.next(undefined);
  }

  /**
   * Fetches task types from the API based on the given term.
   * The term is used to filter the task types by name.
   * If the API call fails, an error object is populated with the error message and status code,
   * and an empty array is returned.
   * @param {string} term The term to filter the task types by.
   * @returns {Observable<TaskTypeDTO[]>} An observable containing an array of task types.
   */
  getTaskData(term: string): Observable<TaskTypeDTO[]> {
    return this._httpClient
      .get<TaskTypeDTO[]>(`${this._baseUrlTaskType}?name=${term}`)
      .pipe(
        catchError((error) => {
          this.taskDataError.message = error.message;
          this.taskDataError.statusCode = error.status;
          return of([]);
        }),
        finalize(() => this.isLoading$.next(false))
      );
  }

  /**
   * Saves a new time log to the API.
   * If the API call fails, an error object is populated with the error message and status code,
   * and an empty observable is returned.
   * @param {any} data The time log data to be saved.
   * @returns {Observable<TimeLogDTO>} An observable containing the saved time log, or an empty observable if the API call fails.
   */
  saveTaskData(data: any): Observable<TimeLogDTO> {
    this.isLoading$.next(true);
    return this._httpClient.post<TimeLogDTO>(`${this._baseUrlLog}`, data).pipe(
      tap(() => this.refreshLogData()),
      catchError((error) => {
        this.taskDataError.message = error.message;
        this.taskDataError.statusCode = error.status;
        return EMPTY;
      }),
      finalize(() => this.isLoading$.next(false))
    );
  }
}
