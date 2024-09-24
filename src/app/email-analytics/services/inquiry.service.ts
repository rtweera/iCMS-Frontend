import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InquiryDataResponse, InquiryPopupData } from '../interfaces/inquiries';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators'; // BUG: remove in production
import { Filter } from '../interfaces/filters';
import { UtilityService } from './utility.service';
import { SETTINGS, URLS, ERRORS } from './app.constants';
@Injectable({
  providedIn: 'root'
})
export class InquiryService {

  constructor(private http: HttpClient, private utility: UtilityService) { }
        
  /**
   * Retrieves inquiry data based on the provided filter criteria, skip, and limit.
   * @param filterCriteria - The filter criteria for the inquiry data.
   * @param skip - The number of records to skip.
   * @param limit - The maximum number of records to retrieve.
   * @returns An Observable of type InquiryMetaDataResponse.
   */
  getInquiryData(filterCriteria: Filter, skip: number, limit: number): Observable<InquiryDataResponse> {
    let params = this.utility.buildFilterParams(filterCriteria, limit, skip);
    return this.http
    .get<InquiryDataResponse>(`${URLS.baseUrlv2}/inquiries?${params}`)
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

  getInquiryAdditionalData(id: string): Observable<InquiryPopupData> {
    return this.http
      .get<InquiryPopupData>(`${URLS.baseUrlv2}/inquiries/${id}`)
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
}
