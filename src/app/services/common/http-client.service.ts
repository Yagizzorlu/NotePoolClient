import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient: HttpClient, @Inject("baseUrl") private baseUrl: string) { }
  private url(requestParameter: Partial<RequestParameters>): string {
    const base = requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl;
    const action = requestParameter.action ? `/${requestParameter.action}` : "";
    
    return `${base}/${requestParameter.controller}${action}`;
  }

  get<T>(requestParameter: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = "";

    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      // Query String varsa ? ile ekle, yoksa boş bırak
      const query = requestParameter.queryString ? `?${requestParameter.queryString}` : "";
      const pathId = id ? `/${id}` : "";
      
      url = `${this.url(requestParameter)}${pathId}${query}`;
    }

    return this.httpClient.get<T>(url, { headers: requestParameter.headers });
  }

  post<T>(requestParameter: Partial<RequestParameters>, body: any): Observable<T> {
    let url: string = "";
    
    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      const query = requestParameter.queryString ? `?${requestParameter.queryString}` : "";
      url = `${this.url(requestParameter)}${query}`;
    }

    return this.httpClient.post<T>(url, body, { headers: requestParameter.headers });
  }

  put<T>(requestParameter: Partial<RequestParameters>, body: any): Observable<T> {
    let url: string = "";
    
    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      const query = requestParameter.queryString ? `?${requestParameter.queryString}` : "";
      url = `${this.url(requestParameter)}${query}`;
    }

    return this.httpClient.put<T>(url, body, { headers: requestParameter.headers });
  }

  delete<T>(requestParameter: Partial<RequestParameters>, id: string): Observable<T> {
    let url: string = "";
    
    if (requestParameter.fullEndPoint) {
      url = requestParameter.fullEndPoint;
    } else {
      const query = requestParameter.queryString ? `?${requestParameter.queryString}` : "";
      url = `${this.url(requestParameter)}/${id}${query}`;
    }

    return this.httpClient.delete<T>(url, { headers: requestParameter.headers });
  }
}

export class RequestParameters {
  controller?: string;
  action?: string;
  queryString?: string;
  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;
}

