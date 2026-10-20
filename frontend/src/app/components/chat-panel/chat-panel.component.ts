import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, ChatMessage } from '../../services/api.service';

const SAMPLE_QUESTIONS = [
  'What was the portfolio valuation at year end 2025?',
  'What is the EPRA NTA per share?',
  'What were the key leasing highlights?',
  'What is the vacancy rate across the portfolio?',
  'How much ERV growth was achieved?',
  'What is the company\'s net zero carbon target?',
  'What is the EPRA LTV ratio?',
  'What was the total dividend for 2024?',
  'Describe the Covent Garden destination',
  'What are the ESG ratings and benchmarks?',
  'Who is on the leadership team?',
  'What is the company\'s approach to sustainability?',
];

@Component({
  selector: 'app-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="agent-container">
      <div class="chat-column">
        <div class="messages" #messagesEl>
          <div class="welcome" *ngIf="messages.length === 0">
            <div class="welcome-icon">🤖</div>
            <h3>Shaftesbury Capital Assistant</h3>
            <p>Ask questions about annual reports, financial results, ESG strategy, and portfolio performance.</p>
          </div>
          <div *ngFor="let msg of messages" class="msg" [ngClass]="msg.role">
            <div class="msg-label">{{msg.role === 'user' ? 'You' : 'Assistant'}}</div>
            <div class="msg-bubble">{{msg.text}}</div>
          </div>
          <div *ngIf="loading" class="msg assistant">
            <div class="msg-label">Assistant</div>
            <div class="msg-bubble thinking">Thinking...</div>
          </div>
        </div>
        <div class="input-row">
          <input
            [(ngModel)]="input"
            (keydown.enter)="send()"
            placeholder="Ask about Shaftesbury Capital..."
            class="chat-input"
            [disabled]="loading"
          />
          <button class="btn-send" (click)="send()" [disabled]="loading || !input.trim()">Go</button>
          <button class="btn-clear" (click)="clear()" [disabled]="messages.length === 0">Clear</button>
        </div>
      </div>

      <div class="config-sidebar">
        <div class="config-section">
          <div class="config-label">Agent</div>
          <div class="agent-badge">
            <span class="agent-dot"></span>
            Shaftesbury Capital
          </div>
        </div>
        <div class="config-section">
          <div class="config-label">Documents</div>
          <div class="doc-tag" *ngFor="let doc of documents">{{doc}}</div>
        </div>
        <div class="config-section">
          <div class="config-label">Sample Questions</div>
          <div class="sample-q" *ngFor="let q of sampleQuestions" (click)="askSample(q)">
            {{q}}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .agent-container {
      display: flex;
      gap: 24px;
      height: calc(100vh - 80px);
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .chat-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .messages {
      flex: 1;
      overflow-y: auto;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      background: #fff;
      margin-bottom: 12px;
    }
    .welcome {
      text-align: center;
      padding: 60px 20px;
      color: #64748b;
    }
    .welcome-icon { font-size: 40px; margin-bottom: 12px; }
    .welcome h3 {
      font-size: 18px;
      font-weight: 600;
      color: var(--shc-navy);
      margin-bottom: 8px;
    }
    .welcome p { font-size: 14px; line-height: 1.6; }

    .msg { margin-bottom: 16px; }
    .msg.user { text-align: right; }
    .msg.assistant { text-align: left; }
    .msg-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
      margin-bottom: 4px;
    }
    .msg-bubble {
      display: inline-block;
      max-width: 80%;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.6;
      text-align: left;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .msg.user .msg-bubble {
      background: #1e3a5f;
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .msg.assistant .msg-bubble {
      background: #f8f9fa;
      color: #1a2332;
      border-bottom-left-radius: 4px;
      border: 1px solid #e9ecef;
    }
    .thinking {
      color: #94a3b8 !important;
      font-style: italic;
    }

    .input-row {
      display: flex;
      gap: 8px;
    }
    .chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
    }
    .chat-input:focus { border-color: var(--shc-blue); }
    .btn-send {
      padding: 12px 24px;
      background: var(--shc-navy);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-send:hover:not(:disabled) { background: var(--shc-navy-light); }
    .btn-send:disabled { opacity: 0.4; cursor: not-allowed; }
    .btn-clear {
      padding: 12px 16px;
      background: #e9ecef;
      color: #6c757d;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      font-family: inherit;
    }
    .btn-clear:hover:not(:disabled) { background: #dee2e6; }
    .btn-clear:disabled { opacity: 0.4; cursor: not-allowed; }

    .config-sidebar {
      width: 300px;
      min-width: 300px;
      background: #f8f9fa;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      overflow-y: auto;
    }
    .config-section {
      margin-bottom: 20px;
    }
    .config-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
      margin-bottom: 8px;
    }
    .agent-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(26, 31, 54, 0.08);
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--shc-navy);
    }
    .agent-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
    }
    .doc-tag {
      display: inline-block;
      padding: 4px 10px;
      background: #e0e7ff;
      color: #3730a3;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      margin: 0 4px 4px 0;
    }
    .sample-q {
      padding: 8px 12px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 12px;
      color: #475569;
      cursor: pointer;
      margin-bottom: 6px;
      transition: all 0.15s;
      line-height: 1.4;
    }
    .sample-q:hover {
      background: #eef2ff;
      border-color: #c7d2fe;
      color: #1e3a8a;
    }
  `]
})
export class ChatPanelComponent implements AfterViewChecked {
  @ViewChild('messagesEl') messagesEl!: ElementRef;
  input = '';
  messages: ChatMessage[] = [];
  loading = false;
  documents = ['Annual Report 2025', 'Annual Report 2024', 'FY25 Results', 'H1 2026 Results'];
  sampleQuestions = SAMPLE_QUESTIONS;

  constructor(private api: ApiService) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.messagesEl) {
      const el = this.messagesEl.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  send() {
    const text = this.input.trim();
    if (!text || this.loading) return;
    this.messages.push({ role: 'user', text });
    this.input = '';
    this.loading = true;

    const history = this.messages.slice(0, -1);

    this.api.sendAgentChat(text, history).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', text: res.answer || 'No response.' });
        this.loading = false;
      },
      error: () => {
        this.messages.push({ role: 'assistant', text: 'Sorry, something went wrong.' });
        this.loading = false;
      }
    });
  }

  askSample(q: string) {
    this.input = q;
    this.send();
  }

  clear() {
    this.messages = [];
  }
}
