import { Injectable,ViewChild } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import { GridComponent } from '../components/grid/grid.component';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  @ViewChild(GridComponent) gridComponent!: GridComponent;


  private socket$: WebSocketSubject<any> | null = null;
  private messagesSubject$ = new Subject<any>();
  public messages$ = this.messagesSubject$.asObservable();

  private baseUrl = 'http://127.0.0.1:8015/charts';

  username:any;


  constructor(private http: HttpClient) {
    this.connect();
  }

  private connect() {
    this.socket$ = webSocket(`${this.baseUrl}/ws`);

    this.socket$.subscribe(
      message => this.messagesSubject$.next(message),
      // err => console.error(err),
      // () => console.warn('Completed!')
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


  chartData(token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}/chartData`,{ headers });
  }

  gridDeleted(id:string,token:string): Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<any>(`${this.baseUrl}/gridDeleted/${id}`,{ headers });

  }

  newWidget(token:string,widgetData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.baseUrl}/newWidget`, {'widget':widgetData}, { headers });
  }

  saveGridLayout(token:string,widgetData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/gridChanged`, {'items':widgetData}, { headers });
  }

  saveGridStatus(token:string,id:string,status:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.baseUrl}/gridStatus`, {'id':id , 'status':status}, { headers });
  }


  widgetsUser(token:string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.baseUrl}/widgetsUser`, { headers });
}


}
