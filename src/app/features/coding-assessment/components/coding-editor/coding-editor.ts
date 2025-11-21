import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import type { editor } from 'monaco-editor';
import { Store } from '@ngrx/store';
import { Task, TaskType, CodingTaskContent } from '@app/core/models/tasks-model';
import { selectTimerDisplay } from '@app/store/tasks/tasks.selectors';

@Component({
  selector: 'app-coding-editor',
  imports: [FormsModule, MonacoEditorModule],
  templateUrl: './coding-editor.html',
  styleUrl: './coding-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodingEditor {
  constructor(private store: Store) {}

  public readonly task = input.required<Task | null>();
  public readonly userCode = input.required<string>();
  public readonly timerDisplay = this.store.selectSignal(selectTimerDisplay);

  public readonly codeChanged = output<string>();
  public readonly runCode = output<void>();

  public readonly codingContent = computed(() => {
    const task = this.task();
    return task?.type === TaskType.CODING ? (task.content as CodingTaskContent) : null;
  });

  public readonly initialCode = computed(() => {
    return this.codingContent()?.starterCode || '';
  });

  public readonly language = computed(() => {
    const task = this.task();
    return task?.skillName.toLowerCase() || 'javascript';
  });

  public readonly editorOptions = computed(() => ({
    theme: 'vs-dark',
    language: this.language(),
    minimap: { enabled: false },
    automaticLayout: true,
    fontSize: 18,
    fontWeight: 600,
    lineNumbers: 'on',
    scrollBeyondLastLine: false,
    padding: { top: 8, bottom: 8 },
    lineNumbersMinChars: 3,
    renderLineHighlight: 'none',
  }));

  private editorInstance?: editor.IStandaloneCodeEditor;

  public onEditorInit(editor: editor.IStandaloneCodeEditor): void {
    this.editorInstance = editor;
  }

  public onCodeChange(code: string): void {
    this.codeChanged.emit(code);
  }

  public onRunCode(): void {
    this.runCode.emit();
  }
}
