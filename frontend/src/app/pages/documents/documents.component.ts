import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Documents</h1>
      <p class="page-subtitle">Annual reports, ESG reports, and press releases with AI-powered summaries</p>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value">{{documents.length}}</div>
          <div class="kpi-label">Total Documents</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{annualCount}}</div>
          <div class="kpi-label">Annual Reports</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{esgCount}}</div>
          <div class="kpi-label">ESG Reports</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{avgSentiment}}</div>
          <div class="kpi-label">Avg Sentiment Score</div>
        </div>
      </div>

      <div class="filter-row">
        <button class="filter-btn" [class.active]="filter === 'all'" (click)="filter='all'">All</button>
        <button class="filter-btn" [class.active]="filter === 'Financial'" (click)="filter='Financial'">Financial</button>
        <button class="filter-btn" [class.active]="filter === 'ESG'" (click)="filter='ESG'">ESG</button>
      </div>

      <div class="doc-grid">
        <div class="doc-card" *ngFor="let d of filtered">
          <div class="doc-header">
            <span class="doc-type-badge" [ngClass]="d.DOC_CATEGORY?.toLowerCase()">{{d.DOC_TYPE}}</span>
            <span class="doc-date">{{d.PUBLISHED_DATE}}</span>
          </div>
          <div class="doc-title">{{d.DOC_TITLE}}</div>
          <div class="doc-meta">
            <span>{{d.PAGE_COUNT}} pages</span>
            <span class="sentiment-badge" [ngClass]="d.SENTIMENT?.toLowerCase()">
              {{d.SENTIMENT}} ({{d.SENTIMENT_SCORE}})
            </span>
          </div>
          <div class="doc-summary">{{d.SUMMARY}}</div>
          <div class="doc-actions">
            <a *ngIf="d.SOURCE_URL" [href]="d.SOURCE_URL" target="_blank" class="doc-link">View Original PDF</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-row { display: flex; gap: 8px; margin-bottom: 20px; }
    .filter-btn {
      padding: 6px 16px; border-radius: 20px; border: 1px solid var(--shc-gray-200);
      background: #fff; font-size: 13px; cursor: pointer; font-family: inherit; color: var(--shc-gray-600);
    }
    .filter-btn.active { background: var(--shc-navy); color: #fff; border-color: var(--shc-navy); }
    .doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 16px; }
    .doc-card {
      background: #fff; border-radius: 10px; padding: 20px; box-shadow: var(--shc-shadow);
      transition: box-shadow 0.2s;
    }
    .doc-card:hover { box-shadow: var(--shc-shadow-lg); }
    .doc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .doc-type-badge {
      padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;
    }
    .doc-type-badge.financial { background: #dbe4ff; color: var(--shc-blue); }
    .doc-type-badge.esg { background: #ebfbee; color: var(--shc-green); }
    .doc-date { font-size: 12px; color: var(--shc-gray-600); }
    .doc-title { font-size: 16px; font-weight: 700; color: var(--shc-navy); margin-bottom: 8px; }
    .doc-meta { display: flex; gap: 12px; align-items: center; font-size: 12px; color: var(--shc-gray-600); margin-bottom: 12px; }
    .sentiment-badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .sentiment-badge.positive { background: #ebfbee; color: var(--shc-green); }
    .sentiment-badge.neutral { background: #fff9db; color: #e67700; }
    .sentiment-badge.negative { background: #fde8e8; color: #c62828; }
    .doc-summary { font-size: 13px; line-height: 1.6; color: var(--shc-gray-600); margin-bottom: 14px; }
    .doc-actions { display: flex; gap: 8px; }
    .doc-link {
      padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;
      background: var(--shc-navy); color: #fff; transition: background 0.15s;
    }
    .doc-link:hover { background: var(--shc-navy-light); }
  `]
})
export class DocumentsComponent implements OnInit {
  documents: any[] = [];
  filter = 'all';
  annualCount = 0;
  esgCount = 0;
  avgSentiment = '0.00';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDocuments().subscribe(d => {
      this.documents = d;
      this.annualCount = d.filter((x: any) => x.DOC_CATEGORY === 'Financial').length;
      this.esgCount = d.filter((x: any) => x.DOC_CATEGORY === 'ESG').length;
      const scores = d.map((x: any) => x.SENTIMENT_SCORE || 0);
      this.avgSentiment = (scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(2);
    });
  }

  get filtered() {
    if (this.filter === 'all') return this.documents;
    return this.documents.filter((d: any) => d.DOC_CATEGORY === this.filter);
  }
}
