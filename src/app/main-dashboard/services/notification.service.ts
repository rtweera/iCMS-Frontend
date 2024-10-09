import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { notificationsEndpoint } from "../../app-settings/config";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private socket$: WebSocketSubject<any> | null = null;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.asObservable();

  private baseUrl = notificationsEndpoint;
  // private baseUrl = 'http://127.0.0.1:8001/Notifications';

  constructor(private http: HttpClient) {
    this.connect();
  }

  private connect() {

    this.socket$ = webSocket(`${this.baseUrl}/ws`);

    this.socket$.subscribe(
      message => this.messagesSubject$.next(message),
      err => console.error(err),
      () => console.warn('Completed!')
    );
  }

  sendMessage(msg: any) {
    if (this.socket$) {
      this.socket$.next(msg);
    } else {
      // console.error('WebSocket is not connected');
    }
  }

  close() {
    if (this.socket$) {
      this.socket$.complete();
    } else {
      // console.error('WebSocket is not connected');
    }
  }


  getNotifications(token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Replace 'apiEndpoint' with your actual API endpoint
    return this.http.get<any>(`${this.baseUrl}/Newnotification`,{headers});
  }

  getNotificationsCounts(token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    // Replace 'apiEndpoint' with your actual API endpoint
    return this.http.get<any>(`${this.baseUrl}/NewnotificationCounts`,{headers});
  }

  updateUnreadNotifications(token:string,notificationData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    // Replace 'apiEndpoint' with your actual API endpoint
    return this.http.post<any>(`${this.baseUrl}/Unreadpost`,{"id":notificationData},{ headers });
  }

  updateReadNotifications(token:string,notificationData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    // Replace 'apiEndpoint' with your actual API endpoint
    return this.http.post<any>(`${this.baseUrl}/Readpost`,{"id":notificationData},{ headers });
  }

  getReadNotifications(token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    // Replace 'apiEndpoint' with your actual API endpoint
    return this.http.get<any>(`${this.baseUrl}/Readnotification`,{headers});
  }


}
