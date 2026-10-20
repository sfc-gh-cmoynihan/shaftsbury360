import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Executive Dashboard</h1>
      <p class="page-subtitle">Shaftesbury Capital — London's West End Portfolio Overview</p>

      <div class="kpi-grid">
        <div class="kpi-card" *ngFor="let kpi of portfolioKpis">
          <div class="kpi-value">{{kpi.display}}</div>
          <div class="kpi-label">{{kpi.METRIC_NAME}}</div>
        </div>
      </div>

      <div class="two-col">
        <div class="card">
          <h3 class="section-title">Financial Performance — H1 2026</h3>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>Metric</th><th>Value</th><th>Category</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let f of financials">
                  <td>{{f.METRIC_NAME}}</td>
                  <td><strong>{{f.METRIC_VALUE}}{{f.METRIC_UNIT === '%' ? '%' : f.METRIC_UNIT === 'x' ? 'x' : ''}}{{f.METRIC_UNIT === 'pence' ? 'p' : ''}}{{f.METRIC_UNIT === '£m' ? ' £m' : ''}}</strong></td>
                  <td><span class="badge" [ngClass]="getBadgeClass(f.CATEGORY)">{{f.CATEGORY}}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">Leadership</h3>
          <div class="leader" *ngFor="let l of leaders">
            <div class="leader-header">
              <div class="leader-avatar">{{l.NAME?.charAt(0)}}</div>
              <div>
                <div class="leader-name">{{l.NAME}}</div>
                <div class="leader-title">{{l.TITLE}}</div>
              </div>
            </div>
            <blockquote class="leader-quote">"{{l.QUOTE}}"</blockquote>
          </div>

          <h3 class="section-title" style="margin-top:24px">Sustainability</h3>
          <div class="sus-row" *ngFor="let s of sustainability">
            <span class="sus-label">{{s.METRIC_NAME}}</span>
            <span class="sus-value">{{s.METRIC_VALUE}}{{s.METRIC_UNIT}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .two-col {
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 20px;
    }
    .leader {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--shc-gray-100);
    }
    .leader:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .leader-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .leader-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--shc-navy);
      color: var(--shc-white);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 16px;
    }
    .leader-name { font-weight: 600; font-size: 15px; color: var(--shc-navy); }
    .leader-title { font-size: 13px; color: var(--shc-gray-600); }
    .leader-quote {
      font-size: 13px;
      line-height: 1.6;
      color: var(--shc-gray-600);
      font-style: italic;
      border-left: 3px solid var(--shc-gold);
      padding-left: 14px;
    }
    .sus-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--shc-gray-100);
      font-size: 14px;
    }
    .sus-label { color: var(--shc-gray-600); }
    .sus-value { font-weight: 600; color: var(--shc-navy); }
  `]
})
export class DashboardComponent implements OnInit {
  portfolioKpis: any[] = [];
  financials: any[] = [];
  leaders: any[] = [];
  sustainability: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPortfolioSummary().subscribe(data => {
      this.portfolioKpis = data.map((d: any) => ({
        ...d,
        display: d.METRIC_UNIT?.startsWith('£')
          ? `£${d.METRIC_VALUE}${d.METRIC_UNIT.replace('£', '')}`
          : `${d.METRIC_VALUE}${d.METRIC_UNIT === '%' ? '%' : ''}`
      }));
    });
    this.api.getFinancialHighlights().subscribe(data => this.financials = data);
    this.api.getLeadership().subscribe(data => this.leaders = data);
    this.api.getSustainability().subscribe(data => this.sustainability = data);
  }

  getBadgeClass(cat: string): string {
    const map: Record<string, string> = {
      'Earnings': 'badge-green',
      'Valuation': 'badge-blue',
      'Balance Sheet': 'badge-gold',
      'Returns': 'badge-green',
      'Operations': 'badge-blue',
    };
    return map[cat] || 'badge-blue';
  }
}
