import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Portfolio Overview</h1>
      <p class="page-subtitle">Impossible-to-replicate destinations in London's West End</p>

      <div class="kpi-grid">
        <div class="kpi-card" *ngFor="let kpi of summary">
          <div class="kpi-value">
            {{kpi.METRIC_UNIT?.startsWith('£') ? '£' : ''}}{{kpi.METRIC_VALUE}}{{kpi.METRIC_UNIT === '%' ? '%' : ''}}
          </div>
          <div class="kpi-label">{{kpi.METRIC_NAME}}</div>
        </div>
      </div>

      <h2 class="section-title">Destinations by Valuation</h2>
      <div class="dest-grid">
        <div class="dest-card card" *ngFor="let d of destinations">
          <div class="dest-header">
            <h3 class="dest-name">{{d.DESTINATION_NAME}}</h3>
            <span class="dest-pct">{{d.VALUATION_PCT}}%</span>
          </div>
          <div class="dest-val">£{{d.VALUATION_BN}}bn</div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="d.VALUATION_PCT"></div>
          </div>
          <p class="dest-desc">{{d.DESCRIPTION}}</p>
          <div class="dest-features">
            <span class="feature-tag" *ngFor="let f of d.FEATURES">{{f}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dest-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 20px;
    }
    .dest-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .dest-name { font-size: 18px; font-weight: 600; color: var(--shc-navy); }
    .dest-pct {
      font-size: 24px;
      font-weight: 700;
      color: var(--shc-blue);
    }
    .dest-val {
      font-size: 14px;
      color: var(--shc-gray-600);
      margin-bottom: 10px;
    }
    .progress-bar {
      height: 6px;
      background: var(--shc-gray-200);
      border-radius: 3px;
      margin-bottom: 14px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--shc-blue);
      border-radius: 3px;
      transition: width 0.6s ease;
    }
    .dest-desc {
      font-size: 13px;
      line-height: 1.6;
      color: var(--shc-gray-600);
      margin-bottom: 14px;
    }
    .dest-features { display: flex; flex-wrap: wrap; gap: 6px; }
    .feature-tag {
      padding: 3px 10px;
      background: var(--shc-gray-100);
      border-radius: 20px;
      font-size: 11px;
      color: var(--shc-gray-600);
    }
  `]
})
export class PortfolioComponent implements OnInit {
  summary: any[] = [];
  destinations: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPortfolioSummary().subscribe(data => this.summary = data);
    this.api.getDestinations().subscribe(data => {
      this.destinations = data.map((d: any) => ({
        ...d,
        FEATURES: d.KEY_FEATURES ? d.KEY_FEATURES.split(', ') : [],
      }));
    });
  }
}
