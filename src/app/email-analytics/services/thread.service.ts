import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, timeout } from 'rxjs';
import { UtilityService } from './utility.service';
import { Filter } from '../interfaces/filters';
import { ThreadResponse, ThreadConversationSummary } from '../interfaces/threads';
import { HttpClient } from '@angular/common/http';
import { URLS, SETTINGS, ERRORS } from './app.constants';

@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor(
    private utility: UtilityService,
    private http: HttpClient,
  ) { }

  getHotThreads(criteria: Filter, first: number, rows: number): Observable<ThreadResponse> {
    const params = this.utility.buildFilterParams(criteria, rows, first);
    return this.http
      .get<ThreadResponse>(`${URLS.baseUrlv2}/threads/hot-threads?${params}`)
      .pipe(
        timeout(SETTINGS.timeoutDuration),
        catchError(e => {
          if (e.name === 'TimeoutError') {
            return throwError(() => new Error(ERRORS.timeoutError));
          } else {
            return throwError(() => new Error(ERRORS.unknownFetchError));
          }
        })
      );
    }

  getAllThreads(criteria: Filter, first: number, rows: number): Observable<ThreadResponse> {
    const params = this.utility.buildFilterParams(criteria, rows, first);
    return this.http
      .get<ThreadResponse>(`${URLS.baseUrlv2}/threads?${params}`)
      .pipe(
        timeout(SETTINGS.timeoutDuration),
        catchError(e => {
          if (e.name === 'TimeoutError') {
            return throwError(() => new Error(ERRORS.timeoutError));
          } else {
            return throwError(() => new Error(ERRORS.unknownFetchError));
          }
        })
      );
  }

  getConversationSummary(threadId: string): Observable<ThreadConversationSummary> {
    return this.http
      .get<ThreadConversationSummary>(`${URLS.baseUrlv2}/threads/summary/${threadId}`)
      .pipe(
        timeout(SETTINGS.timeoutDuration),
        catchError(e => {
          if (e.name === 'TimeoutError') {
            return throwError(() => new Error(ERRORS.timeoutError));
          } else {
            console.error(e);
            return throwError(() => new Error(ERRORS.unknownFetchError));
          }
        })
      );
  }
}
