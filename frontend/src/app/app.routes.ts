import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { FinancialsComponent } from './pages/financials/financials.component';
import { DestinationsComponent } from './pages/destinations/destinations.component';
import { NewsComponent } from './pages/news/news.component';
import { UtilitiesComponent } from './pages/utilities/utilities.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { CallsComponent } from './pages/calls/calls.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'financials', component: FinancialsComponent },
  { path: 'destinations', component: DestinationsComponent },
  { path: 'news', component: NewsComponent },
  { path: 'utilities', component: UtilitiesComponent },
  { path: 'documents', component: DocumentsComponent },
  { path: 'calls', component: CallsComponent },
];
