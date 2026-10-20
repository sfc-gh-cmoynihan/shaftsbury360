import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  sendAgentChat(message: string, history: ChatMessage[]): Observable<{answer: string}> {
    return this.http.post<{answer: string}>('/api/agent/chat', { message, history });
  }

  getPortfolioSummary(): Observable<any[]> {
    return this.http.get<any[]>('/api/portfolio/summary');
  }

  getDestinations(): Observable<any[]> {
    return this.http.get<any[]>('/api/portfolio/destinations');
  }

  getFinancialHighlights(): Observable<any[]> {
    return this.http.get<any[]>('/api/financials/highlights');
  }

  getFinancialHistory(): Observable<any[]> {
    return this.http.get<any[]>('/api/financials/history');
  }

  getNews(): Observable<any[]> {
    return this.http.get<any[]>('/api/news');
  }

  getSustainability(): Observable<any[]> {
    return this.http.get<any[]>('/api/sustainability');
  }

  getLeadership(): Observable<any[]> {
    return this.http.get<any[]>('/api/leadership');
  }

  getUtilitiesSummary(): Observable<any[]> {
    return this.http.get<any[]>('/api/utilities/summary');
  }
  getUtilitiesProperties(): Observable<any[]> {
    return this.http.get<any[]>('/api/utilities/properties');
  }
  getUtilitiesAlerts(): Observable<any[]> {
    return this.http.get<any[]>('/api/utilities/alerts');
  }
  getUtilitiesReadings(propertyId: string, utilityType: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/utilities/readings?property_id=${propertyId}&utility_type=${utilityType}`);
  }
  getDocuments(): Observable<any[]> {
    return this.http.get<any[]>('/api/documents');
  }
  getCalls(): Observable<any[]> {
    return this.http.get<any[]>('/api/calls');
  }
  getCallsRedFlags(): Observable<any[]> {
    return this.http.get<any[]>('/api/calls/red-flags');
  }
}
