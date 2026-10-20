import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-calls',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Calls</h1>
      <p class="page-subtitle">Executive and legal calls across all tenants and properties</p>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value">{{calls.length}}</div>
          <div class="kpi-label">Total Calls</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value" style="color:var(--shc-red)">{{redFlagCount}}</div>
          <div class="kpi-label">Red Flags</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{escalatedCount}}</div>
          <div class="kpi-label">Escalated</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">{{openCount}}</div>
          <div class="kpi-label">Open Actions</div>
        </div>
      </div>

      <div class="red-flags-section" *ngIf="redFlags.length > 0">
        <h3 class="section-title" style="color:var(--shc-red)">Red Flags — Requires Attention</h3>
        <div class="flag-grid">
          <div class="flag-card" *ngFor="let c of redFlags">
            <div class="flag-header">
              <span class="call-type-badge" [ngClass]="c.CALL_TYPE?.toLowerCase()">{{c.CALL_TYPE}}</span>
              <span class="status-badge" [ngClass]="c.STATUS?.toLowerCase()">{{c.STATUS}}</span>
            </div>
            <div class="flag-title">{{c.TENANT_NAME}} — {{c.PROPERTY_NAME}}</div>
            <div class="flag-dest">{{c.DESTINATION}} | {{c.CONTACT_TITLE}}</div>
            <div class="flag-reason">{{c.RED_FLAG_REASON}}</div>
            <div class="flag-meta">
              <span>{{c.CALL_DATE | date:'d MMM yyyy'}}</span>
              <span>{{c.DURATION_MINUTES}} min</span>
              <span class="sentiment-dot" [ngClass]="c.SENTIMENT?.toLowerCase()">{{c.SENTIMENT}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-row">
        <button class="filter-btn" [class.active]="filter === 'all'" (click)="filter='all'">All Calls</button>
        <button class="filter-btn" [class.active]="filter === 'Executive'" (click)="filter='Executive'">Executive</button>
        <button class="filter-btn" [class.active]="filter === 'Legal'" (click)="filter='Legal'">Legal</button>
      </div>

      <div class="calls-list">
        <div class="call-card" *ngFor="let c of filtered" [class.has-flag]="c.RED_FLAG">
          <div class="call-header">
            <div class="call-left">
              <span class="call-type-badge" [ngClass]="c.CALL_TYPE?.toLowerCase()">{{c.CALL_TYPE}}</span>
              <span class="call-tenant">{{c.TENANT_NAME}}</span>
              <span class="call-contact">{{c.TENANT_CONTACT}} ({{c.CONTACT_TITLE}})</span>
            </div>
            <div class="call-right">
              <span class="status-badge" [ngClass]="c.STATUS?.toLowerCase()?.replace(' ','')">{{c.STATUS}}</span>
              <span *ngIf="c.RED_FLAG" class="red-flag-icon">&#9888;</span>
            </div>
          </div>
          <div class="call-location">
            <strong>{{c.PROPERTY_NAME}}</strong> — {{c.DESTINATION}}
          </div>
          <div class="call-attendee">
            SC: {{c.SHAFTESBURY_ATTENDEE}} ({{c.SHAFTESBURY_TITLE}})
          </div>
          <div class="call-summary">{{c.SUMMARY}}</div>
          <div class="call-actions" *ngIf="c.ACTION_ITEMS">
            <strong>Actions:</strong> {{c.ACTION_ITEMS}}
          </div>
          <div class="call-footer">
            <span>{{c.CALL_DATE | date:'d MMM yyyy HH:mm'}}</span>
            <span>{{c.DURATION_MINUTES}} min</span>
            <span class="sentiment-badge" [ngClass]="c.SENTIMENT?.toLowerCase()">
              {{c.SENTIMENT}} ({{c.SENTIMENT_SCORE}})
            </span>
            <span *ngIf="c.FOLLOW_UP_DATE">Follow-up: {{c.FOLLOW_UP_DATE}}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .red-flags-section { margin-bottom: 28px; }
    .flag-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }
    .flag-card {
      background: #fff; border-radius: 8px; padding: 14px 16px;
      border-left: 4px solid var(--shc-red); box-shadow: var(--shc-shadow);
    }
    .flag-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .flag-title { font-size: 15px; font-weight: 700; color: var(--shc-navy); }
    .flag-dest { font-size: 12px; color: var(--shc-gray-600); margin-bottom: 8px; }
    .flag-reason { font-size: 13px; color: var(--shc-red); font-weight: 600; margin-bottom: 8px; line-height: 1.4; }
    .flag-meta { display: flex; gap: 12px; font-size: 11px; color: var(--shc-gray-400); }

    .call-type-badge {
      padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;
    }
    .call-type-badge.executive { background: #dbe4ff; color: var(--shc-blue); }
    .call-type-badge.legal { background: #fff9db; color: #e67700; }
    .status-badge {
      padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;
    }
    .status-badge.open { background: #dbe4ff; color: var(--shc-blue); }
    .status-badge.closed { background: #ebfbee; color: var(--shc-green); }
    .status-badge.escalated { background: #fde8e8; color: #c62828; }
    .status-badge.inprogress { background: #fff9db; color: #e67700; }
    .red-flag-icon { color: var(--shc-red); font-size: 16px; }

    .sentiment-dot { font-size: 11px; font-weight: 600; }
    .sentiment-dot.positive { color: var(--shc-green); }
    .sentiment-dot.negative { color: var(--shc-red); }
    .sentiment-dot.neutral { color: #e67700; }

    .filter-row { display: flex; gap: 8px; margin-bottom: 16px; }
    .filter-btn {
      padding: 6px 16px; border-radius: 20px; border: 1px solid var(--shc-gray-200);
      background: #fff; font-size: 13px; cursor: pointer; font-family: inherit; color: var(--shc-gray-600);
    }
    .filter-btn.active { background: var(--shc-navy); color: #fff; border-color: var(--shc-navy); }

    .calls-list { display: flex; flex-direction: column; gap: 12px; }
    .call-card {
      background: #fff; border-radius: 10px; padding: 16px 20px; box-shadow: var(--shc-shadow);
    }
    .call-card.has-flag { border-left: 4px solid var(--shc-red); }
    .call-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .call-left { display: flex; align-items: center; gap: 10px; }
    .call-right { display: flex; align-items: center; gap: 8px; }
    .call-tenant { font-weight: 700; font-size: 15px; color: var(--shc-navy); }
    .call-contact { font-size: 12px; color: var(--shc-gray-600); }
    .call-location { font-size: 13px; color: var(--shc-gray-600); margin-bottom: 4px; }
    .call-attendee { font-size: 12px; color: var(--shc-gray-400); margin-bottom: 10px; }
    .call-summary { font-size: 13px; line-height: 1.6; color: var(--shc-gray-600); margin-bottom: 8px; }
    .call-actions {
      font-size: 12px; line-height: 1.5; color: var(--shc-navy); background: var(--shc-gray-50);
      padding: 8px 12px; border-radius: 6px; margin-bottom: 10px;
    }
    .call-footer { display: flex; gap: 16px; font-size: 12px; color: var(--shc-gray-400); align-items: center; }
    .sentiment-badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600; }
    .sentiment-badge.positive { background: #ebfbee; color: var(--shc-green); }
    .sentiment-badge.neutral { background: #fff9db; color: #e67700; }
    .sentiment-badge.negative { background: #fde8e8; color: #c62828; }
  `]
})
export class CallsComponent implements OnInit {
  calls: any[] = [];
  redFlags: any[] = [];
  filter = 'all';
  redFlagCount = 0;
  escalatedCount = 0;
  openCount = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCalls().subscribe(d => {
      this.calls = d;
      this.redFlagCount = d.filter((c: any) => c.RED_FLAG).length;
      this.escalatedCount = d.filter((c: any) => c.STATUS === 'Escalated').length;
      this.openCount = d.filter((c: any) => c.STATUS === 'Open' || c.STATUS === 'In Progress').length;
    });
    this.api.getCallsRedFlags().subscribe(d => this.redFlags = d);
  }

  get filtered() {
    if (this.filter === 'all') return this.calls;
    return this.calls.filter((c: any) => c.CALL_TYPE === this.filter);
  }
}
