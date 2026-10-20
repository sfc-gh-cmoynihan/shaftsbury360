import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ChatPanelComponent } from './components/chat-panel/chat-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ChatPanelComponent],
  template: `
    <div class="app-shell">
      <header class="top-nav">
        <div class="brand">
          <div class="brand-icon">SC</div>
          <div class="brand-text">
            <span class="brand-name">Shaftesbury<strong>360</strong></span>
            <span class="brand-time">{{currentTime}}</span>
          </div>
        </div>
        <nav class="nav-tabs">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-tab" (click)="agentActive=false">
            <span class="tab-icon">📊</span> Dashboard
          </a>
          <a routerLink="/portfolio" routerLinkActive="active" class="nav-tab" (click)="agentActive=false">
            <span class="tab-icon">🏢</span> Portfolio
          </a>
          <a routerLink="/financials" routerLinkActive="active" class="nav-tab" (click)="agentActive=false">
            <span class="tab-icon">💷</span> Financials
          </a>
          <a routerLink="/destinations" routerLinkActive="active" class="nav-tab" (click)="agentActive=false">
            <span class="tab-icon">📍</span> Destinations
          </a>
          <a routerLink="/news" routerLinkActive="active" class="nav-tab" (click)="agentActive=false">
            <span class="tab-icon">📰</span> News
          </a>
          <a routerLink="/utilities" routerLinkActive="active" class="nav-tab" (click)="agentActive=false">
            <span class="tab-icon">⚡</span> Utilities
          </a>
          <a routerLink="/documents" routerLinkActive="active" class="nav-tab" (click)="agentActive=false">
            <span class="tab-icon">📄</span> Documents
          </a>
          <a routerLink="/calls" routerLinkActive="active" class="nav-tab" (click)="agentActive=false">
            <span class="tab-icon">📞</span> Calls
          </a>
          <button class="nav-tab" [class.active]="agentActive" (click)="toggleAgent()">
            <span class="tab-icon">🤖</span> Agent
          </button>
        </nav>
        <span class="version">v1.2</span>
      </header>

      <main class="main-content">
        <div *ngIf="!agentActive">
          <router-outlet></router-outlet>
        </div>
        <app-chat-panel *ngIf="agentActive"></app-chat-panel>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      background: var(--shc-gray-50);
    }
    .top-nav {
      display: flex;
      align-items: center;
      gap: 0;
      padding: 0 20px;
      height: 56px;
      background: var(--shc-navy);
      border-bottom: 1px solid rgba(255,255,255,0.08);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-right: 24px;
    }
    .brand-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      background: var(--shc-gold);
      color: var(--shc-navy);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 11px;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.3;
    }
    .brand-name {
      font-size: 13px;
      font-weight: 300;
      color: #f1f5f9;
      letter-spacing: 0.2px;
    }
    .brand-name strong { font-weight: 700; }
    .brand-time {
      font-size: 10px;
      color: #94a3b8;
      font-family: monospace;
    }
    .nav-tabs {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: 1;
      overflow-x: auto;
    }
    .nav-tab {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 7px 11px;
      border-radius: 6px;
      border: none;
      background: transparent;
      color: #94a3b8;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;
      font-family: inherit;
    }
    .nav-tab:hover {
      background: rgba(255,255,255,0.06);
      color: #cbd5e1;
    }
    .nav-tab.active {
      background: rgba(59, 130, 246, 0.2);
      color: #93c5fd;
      font-weight: 600;
    }
    .tab-icon {
      font-size: 13px;
    }
    .version {
      font-size: 10px;
      color: #64748b;
      font-family: monospace;
      white-space: nowrap;
      margin-left: 12px;
    }
    .main-content {
      min-height: calc(100vh - 56px);
    }
  `]
})
export class AppComponent {
  agentActive = false;
  currentTime = '';

  constructor(private router: Router) {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);
  }

  updateTime() {
    this.currentTime = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
  }

  toggleAgent() {
    this.agentActive = !this.agentActive;
    if (!this.agentActive) {
      this.router.navigate(['/dashboard']);
    }
  }
}
