import { TestBed } from '@angular/core/testing';
import { TaskMockService } from './task-mock.service';
import {
  TaskStatus,
  TaskType,
  TaskDifficulty,
  TaskUI,
  CompletedPeriod,
} from '../../../core/models/tasks-model';

describe('TaskMockService', () => {
  let service: TaskMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTasks', () => {
    it('should return grouped tasks response with pending and completed tasks', (done) => {
      service.getAllTasks().subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.message).toBe('Tasks retrieved successfully');
        expect(response.data).toBeDefined();
        expect(response.data.pending).toBeDefined();
        expect(response.data.completed).toBeDefined();
        expect(response.metadata).toBeDefined();
        done();
      });
    });

    it('should filter tasks by skillName', (done) => {
      service.getAllTasks({ skillName: 'Python' }).subscribe((response) => {
        const pendingTasks = response.data.pending.content;
        const completedTasks = response.data.completed.content;

        pendingTasks.forEach((task) => {
          expect(task.skillName.toLowerCase()).toContain('python');
        });

        completedTasks.forEach((task) => {
          expect(task.skillName.toLowerCase()).toContain('python');
        });
        done();
      });
    });

    it('should filter completed tasks by period', (done) => {
      service.getAllTasks({ completedPeriod: CompletedPeriod.TODAY }).subscribe((response) => {
        const completedTasks = response.data.completed.content;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        completedTasks.forEach((task) => {
          const taskDate = new Date(task.createdAt);
          expect(taskDate.getTime()).toBeGreaterThanOrEqual(today.getTime());
        });
        done();
      });
    });

    it('should return all tasks when no filters applied', (done) => {
      service.getAllTasks({}).subscribe((response) => {
        expect(response.data.pending.content.length).toBe(4);
        expect(response.data.completed.content.length).toBe(2);
        done();
      });
    });

    it('should return pending tasks with correct structure', (done) => {
      service.getAllTasks().subscribe((response) => {
        const pendingTasks = response.data.pending.content as TaskUI[];
        expect(pendingTasks.length).toBe(4);

        const firstTask = pendingTasks[0];
        expect(firstTask.id).toBe('t1');
        expect(firstTask.title).toBe('Fix The Print Statement');
        expect(firstTask.status).toBe(TaskStatus.PENDING);
        expect(firstTask.type).toBe(TaskType.CODING);
        expect(firstTask.difficulty).toBe(TaskDifficulty.BEGINNER);
        done();
      });
    });

    it('should return completed tasks with correct structure', (done) => {
      service.getAllTasks().subscribe((response) => {
        const completedTasks = response.data.completed.content as TaskUI[];
        expect(completedTasks.length).toBe(2);

        const firstTask = completedTasks[0];
        expect(firstTask.id).toBe('c1');
        expect(firstTask.status).toBe(TaskStatus.COMPLETED);
        done();
      });
    });

    it('should return paginated response structure', (done) => {
      service.getAllTasks().subscribe((response) => {
        const pendingPage = response.data.pending;
        expect(pendingPage.totalElements).toBe(4);
        expect(pendingPage.totalPages).toBe(1);
        expect(pendingPage.first).toBe(true);
        expect(pendingPage.last).toBe(true);
        expect(pendingPage.size).toBe(10);
        expect(pendingPage.number).toBe(0);
        done();
      });
    });

    it('should include API delay', (done) => {
      const startTime = Date.now();
      service.getAllTasks().subscribe(() => {
        const endTime = Date.now();
        expect(endTime - startTime).toBeGreaterThanOrEqual(500);
        done();
      });
    });

    it('should return tasks with all required properties', (done) => {
      service.getAllTasks().subscribe((response) => {
        const task = response.data.pending.content[0];
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('title');
        expect(task).toHaveProperty('description');
        expect(task).toHaveProperty('type');
        expect(task).toHaveProperty('difficulty');
        expect(task).toHaveProperty('content');
        expect(task).toHaveProperty('xpReward');
        expect(task).toHaveProperty('estimatedDuration');
        expect(task).toHaveProperty('skillName');
        expect(task).toHaveProperty('version');
        expect(task).toHaveProperty('icon');
        expect(task).toHaveProperty('status');
        expect(task).toHaveProperty('createdAt');
        done();
      });
    });
  });
});
