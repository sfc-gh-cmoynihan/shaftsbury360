import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-utilities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Utilities Smart Metering</h1>
      <p class="page-subtitle">Real-time gas, electricity, and water monitoring across all properties</p>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value">{{totalProperties}}</div>
          <div class="kpi-label">Properties Monitored</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{alerts.length}}</div>
          <div class="kpi-label" style="color:var(--shc-red)">Active Alerts</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{totalTenants}}</div>
          <div class="kpi-label">Total Tenants</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">3</div>
          <div class="kpi-label">Utility Types</div>
        </div>
      </div>

      <div class="alerts-section" *ngIf="alerts.length > 0">
        <h3 class="section-title" style="color:var(--shc-red)">Red Flags — Over Usage Alerts</h3>
        <div class="alert-grid">
          <div class="alert-card" *ngFor="let a of alerts">
            <div class="alert-header">
              <span class="severity-badge" [ngClass]="a.SEVERITY?.toLowerCase()">{{a.SEVERITY}}</span>
              <span class="alert-type">{{a.UTILITY_TYPE}}</span>
            </div>
            <div class="alert-property">{{a.PROPERTY_NAME}}</div>
            <div class="alert-dest">{{a.DESTINATION}}</div>
            <div class="alert-detail">
              <span>Usage: <strong>{{a.DAILY_USAGE_KWH}} kWh</strong></span>
              <span>Budget: {{a.DAILY_BUDGET_KWH}} kWh</span>
              <span class="overage">+{{a.OVERAGE_PCT}}% over</span>
            </div>
            <div class="alert-date">{{a.ALERT_DATE}}</div>
          </div>
        </div>
      </div>

      <div class="two-col">
        <div class="card">
          <h3 class="section-title">Destination Summary</h3>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr><th>Destination</th><th>Properties</th><th>Avg Tenants</th><th>Electric Budget</th><th>Gas Budget</th><th>Water Budget</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of summary">
                  <td><strong>{{s.DESTINATION}}</strong></td>
                  <td>{{s.PROPERTY_COUNT}}</td>
                  <td>{{s.AVG_TENANTS}}</td>
                  <td>{{s.ELECTRIC_BUDGET}} kWh</td>
                  <td>{{s.GAS_BUDGET}} kWh</td>
                  <td>{{s.WATER_BUDGET}} kWh</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <h3 class="section-title">Properties by Status</h3>
          <div class="status-row" *ngFor="let p of properties">
            <div class="prop-info">
              <span class="prop-name">{{p.PROPERTY_NAME}}</span>
              <span class="prop-type">{{p.UTILITY_TYPE}}</span>
            </div>
            <div class="prop-meta">
              <span>{{p.TENANT_COUNT}} tenants</span>
              <span>{{p.AVG_RATE_PER_KWH}}p/kWh</span>
              <span class="status-badge" [ngClass]="p.STATUS?.toLowerCase()?.replace(' ','')">{{p.STATUS}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .two-col { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }
    .alerts-section { margin-bottom: 28px; }
    .alert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
    .alert-card {
      background: #fff; border-radius: 8px; padding: 14px 16px;
      border-left: 4px solid var(--shc-red); box-shadow: var(--shc-shadow);
    }
    .alert-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .severity-badge {
      padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase;
    }
    .severity-badge.critical { background: #fde8e8; color: #c62828; }
    .severity-badge.warning { background: #fff3e0; color: #e65100; }
    .alert-type { font-size: 12px; color: var(--shc-gray-600); font-weight: 600; }
    .alert-property { font-size: 15px; font-weight: 600; color: var(--shc-navy); }
    .alert-dest { font-size: 12px; color: var(--shc-gray-600); margin-bottom: 8px; }
    .alert-detail { display: flex; gap: 12px; font-size: 12px; color: var(--shc-gray-600); }
    .alert-detail strong { color: var(--shc-navy); }
    .overage { color: var(--shc-red); font-weight: 600; }
    .alert-date { font-size: 11px; color: var(--shc-gray-400); margin-top: 6px; }

    .status-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 0; border-bottom: 1px solid var(--shc-gray-100); font-size: 13px;
    }
    .prop-info { display: flex; flex-direction: column; gap: 2px; }
    .prop-name { font-weight: 600; color: var(--shc-navy); }
    .prop-type { font-size: 11px; color: var(--shc-gray-600); }
    .prop-meta { display: flex; gap: 12px; align-items: center; font-size: 12px; color: var(--shc-gray-600); }
    .status-badge {
      padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;
    }
    .status-badge.normal { background: #ebfbee; color: var(--shc-green); }
    .status-badge.overusage { background: #fff3e0; color: #e65100; }
    .status-badge.critical { background: #fde8e8; color: #c62828; }
  `]
})
export class UtilitiesComponent implements OnInit {
  summary: any[] = [];
  properties: any[] = [];
  alerts: any[] = [];
  totalProperties = 0;
  totalTenants = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getUtilitiesSummary().subscribe(d => {
      this.summary = d;
      this.totalProperties = d.reduce((s: number, r: any) => s + (r.PROPERTY_COUNT || 0), 0);
      this.totalTenants = d.reduce((s: number, r: any) => s + (r.AVG_TENANTS || 0) * (r.PROPERTY_COUNT || 0), 0);
    });
    this.api.getUtilitiesProperties().subscribe(d => this.properties = d);
    this.api.getUtilitiesAlerts().subscribe(d => this.alerts = d);
  }
}
