import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-financials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Financial Performance</h1>
      <p class="page-subtitle">Key metrics from Annual Report 2025 and H1 2026 Interim Results</p>

      <div class="period-tabs">
        <button *ngFor="let p of periods" class="period-tab" [class.active]="p === selectedPeriod" (click)="selectPeriod(p)">
          {{p}}
        </button>
      </div>

      <div class="fin-grid">
        <div class="fin-category card" *ngFor="let cat of categories">
          <h3 class="section-title">{{cat}}</h3>
          <div class="fin-item" *ngFor="let item of getByCategory(cat)">
            <span class="fin-label">{{item.METRIC_NAME}}</span>
            <span class="fin-value">
              {{item.METRIC_VALUE}}{{item.METRIC_UNIT === '%' ? '%' : item.METRIC_UNIT === 'x' ? 'x' : item.METRIC_UNIT === 'pence' ? 'p' : item.METRIC_UNIT === '£m' ? ' £m' : ''}}
            </span>
          </div>
        </div>
      </div>

      <h2 class="section-title" style="margin-top:32px">Valuation Trend</h2>
      <div class="card">
        <div class="chart-row">
          <div class="chart-bar" *ngFor="let v of valuationTrend">
            <div class="bar-fill" [style.height.%]="v.pct"></div>
            <div class="bar-label">{{v.label}}</div>
            <div class="bar-value">£{{v.value}}bn</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .period-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
    .period-tab {
      padding: 8px 18px;
      border: 1px solid var(--shc-gray-200);
      border-radius: 20px;
      background: var(--shc-white);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .period-tab.active {
      background: var(--shc-navy);
      color: var(--shc-white);
      border-color: var(--shc-navy);
    }
    .fin-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .fin-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid var(--shc-gray-100);
      font-size: 14px;
    }
    .fin-label { color: var(--shc-gray-600); }
    .fin-value { font-weight: 600; color: var(--shc-navy); }
    .chart-row {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 32px;
      height: 220px;
      padding: 16px 0;
    }
    .chart-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 80px;
    }
    .bar-fill {
      width: 100%;
      background: linear-gradient(180deg, var(--shc-blue), var(--shc-blue-light));
      border-radius: 6px 6px 0 0;
      min-height: 8px;
      transition: height 0.6s ease;
    }
    .bar-label {
      font-size: 12px;
      color: var(--shc-gray-600);
      margin-top: 8px;
    }
    .bar-value {
      font-size: 13px;
      font-weight: 600;
      color: var(--shc-navy);
      margin-top: 2px;
    }
  `]
})
export class FinancialsComponent implements OnInit {
  allData: any[] = [];
  filteredData: any[] = [];
  periods: string[] = [];
  selectedPeriod = 'H1 2026';
  categories: string[] = [];
  valuationTrend = [
    { label: 'FY 2023', value: '4.8', pct: 76 },
    { label: 'FY 2024', value: '5.1', pct: 82 },
    { label: 'FY 2025', value: '5.4', pct: 90 },
    { label: 'H1 2026', value: '5.6', pct: 100 },
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getFinancialHistory().subscribe(data => {
      this.allData = data;
      this.periods = [...new Set(data.map((d: any) => d.PERIOD))];
      this.selectPeriod(this.selectedPeriod);
    });
  }

  selectPeriod(period: string) {
    this.selectedPeriod = period;
    this.filteredData = this.allData.filter((d: any) => d.PERIOD === period);
    this.categories = [...new Set(this.filteredData.map((d: any) => d.CATEGORY))];
  }

  getByCategory(cat: string): any[] {
    return this.filteredData.filter((d: any) => d.CATEGORY === cat);
  }
}
