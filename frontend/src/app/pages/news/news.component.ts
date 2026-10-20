import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Latest News</h1>
      <p class="page-subtitle">News and insights from across our destinations</p>

      <div class="filter-row">
        <button class="filter-btn" [class.active]="selectedDest === 'All'" (click)="filter('All')">All</button>
        <button class="filter-btn" [class.active]="selectedDest === 'Covent Garden'" (click)="filter('Covent Garden')">Covent Garden</button>
        <button class="filter-btn" [class.active]="selectedDest === 'Carnaby Street and Soho'" (click)="filter('Carnaby Street and Soho')">Carnaby & Soho</button>
      </div>

      <div class="news-list">
        <div class="news-item card" *ngFor="let n of filteredNews">
          <div class="news-meta">
            <span class="news-date">{{n.PUBLISHED_DATE | date:'d MMM yyyy'}}</span>
            <span class="badge badge-blue">{{n.DESTINATION}}</span>
          </div>
          <h3 class="news-headline">{{n.HEADLINE}}</h3>
          <p class="news-summary">{{n.SUMMARY}}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filter-row {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
    }
    .filter-btn {
      padding: 8px 18px;
      border: 1px solid var(--shc-gray-200);
      border-radius: 20px;
      background: var(--shc-white);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .filter-btn.active {
      background: var(--shc-navy);
      color: var(--shc-white);
      border-color: var(--shc-navy);
    }
    .news-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .news-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .news-date {
      font-size: 13px;
      color: var(--shc-gray-600);
    }
    .news-headline {
      font-size: 17px;
      font-weight: 600;
      color: var(--shc-navy);
      margin-bottom: 6px;
      line-height: 1.4;
    }
    .news-summary {
      font-size: 14px;
      line-height: 1.6;
      color: var(--shc-gray-600);
    }
  `]
})
export class NewsComponent implements OnInit {
  allNews: any[] = [];
  filteredNews: any[] = [];
  selectedDest = 'All';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getNews().subscribe(data => {
      this.allNews = data;
      this.filteredNews = data;
    });
  }

  filter(dest: string) {
    this.selectedDest = dest;
    this.filteredNews = dest === 'All'
      ? this.allNews
      : this.allNews.filter((n: any) => n.DESTINATION === dest);
  }
}
