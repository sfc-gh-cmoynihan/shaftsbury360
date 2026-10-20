import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Our Destinations</h1>
      <p class="page-subtitle">Iconic destinations in the heart of London's West End</p>

      <div class="dest-detail" *ngFor="let d of destinations; let i = index">
        <div class="dest-hero" [ngClass]="'hero-' + i">
          <div class="hero-overlay">
            <h2 class="hero-title">{{d.DESTINATION_NAME}}</h2>
            <div class="hero-val">£{{d.VALUATION_BN}}bn — {{d.VALUATION_PCT}}% of portfolio</div>
          </div>
        </div>
        <div class="dest-body card">
          <p class="dest-desc">{{d.DESCRIPTION}}</p>
          <div class="dest-features">
            <span class="feature-chip" *ngFor="let f of splitFeatures(d.KEY_FEATURES)">{{f}}</span>
          </div>
          <a *ngIf="d.WEBSITE_URL" [href]="d.WEBSITE_URL" target="_blank" class="dest-link">
            Visit Website →
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dest-detail { margin-bottom: 32px; }
    .dest-hero {
      height: 200px;
      border-radius: var(--shc-radius) var(--shc-radius) 0 0;
      position: relative;
      overflow: hidden;
    }
    .hero-0 { background: linear-gradient(135deg, #1a1f36, #3b5bdb); }
    .hero-1 { background: linear-gradient(135deg, #862e9c, #e64980); }
    .hero-2 { background: linear-gradient(135deg, #c2255c, #f76707); }
    .hero-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 24px;
      background: linear-gradient(transparent, rgba(0,0,0,0.6));
      color: white;
    }
    .hero-title { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
    .hero-val { font-size: 14px; opacity: 0.9; }
    .dest-body {
      border-radius: 0 0 var(--shc-radius) var(--shc-radius);
    }
    .dest-desc {
      font-size: 15px;
      line-height: 1.7;
      color: var(--shc-gray-600);
      margin-bottom: 16px;
    }
    .dest-features { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .feature-chip {
      padding: 5px 14px;
      background: var(--shc-gray-100);
      border-radius: 20px;
      font-size: 12px;
      color: var(--shc-gray-600);
    }
    .dest-link {
      display: inline-block;
      color: var(--shc-blue);
      font-weight: 500;
      font-size: 14px;
    }
    .dest-link:hover { text-decoration: underline; }
  `]
})
export class DestinationsComponent implements OnInit {
  destinations: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDestinations().subscribe(data => this.destinations = data);
  }

  splitFeatures(features: string): string[] {
    return features ? features.split(', ') : [];
  }
}
