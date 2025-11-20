import { Component, ChangeDetectionStrategy, input, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CodeExecutionResult,
  TestCaseResult,
} from '@app/features/coding-assessment/models/coding-assessment.model';

@Component({
  selector: 'app-output-console',
  imports: [CommonModule],
  templateUrl: './output-console.html',
  styleUrl: './output-console.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputConsole {
  public readonly taskId = input<string>('');
  public readonly userCode = input<string>('');
  public readonly output = input<CodeExecutionResult | null>(null);
  public readonly testCases = input<TestCaseResult[]>([]);

  public readonly activeTab = signal<'console' | 'tests'>('console');
  public readonly isRunning = signal(false);

  public readonly runCode = output<void>();
  public readonly submitTask = output<void>();

  public setActiveTab(tab: 'console' | 'tests'): void {
    this.activeTab.set(tab);
  }

  public onRunCode(): void {
    this.runCode.emit();
  }

  public onSubmitTask(): void {
    this.submitTask.emit();
  }
}
