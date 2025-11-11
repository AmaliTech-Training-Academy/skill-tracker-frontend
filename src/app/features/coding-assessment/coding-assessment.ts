import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CodingTask } from '@app/core/models/tasks-model';
import { ChallengeDescription } from './components/challenge-description/challenge-description';

@Component({
  selector: 'app-coding-assessment',
  imports: [ChallengeDescription],
  templateUrl: './coding-assessment.html',
  styleUrl: './coding-assessment.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodingAssessment {
  public assessmentStarted = signal(false);

  public mockTask = signal<CodingTask>({
    id: 't1',
    title: '1. Find the First Unique Character',
    description:
      'Given a string s, return the first non-repeating character in it. If no such character exists, return -1.',
    examples: [
      {
        input: 's = "leetcode"',
        output: '0',
        explanation: 'Explanation: The first non-repeating character is "l" at index 0.',
      },
      {
        input: 's = "loveleetcode"',
        output: '2',
        explanation: 'Explanation: The first non-repeating character is "v" at index 2.',
      },
    ],
    skill: 'Data Structures',
    difficulty: 'Beginner',
    estimatedDuration: 15,
    starterCode: '# Fix the print statement below to display "Hello, World!"\nprint("Hello World")',
    language: 'Python',
    xp: 15,
  });

  public onStartTask(): void {
    this.assessmentStarted.set(true);
  }
}
