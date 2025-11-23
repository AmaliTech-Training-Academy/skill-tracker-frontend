import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Dashboard } from './dashboard';

describe('Dashboard (simple)', () => {
  let component: Dashboard;
  let meta: Meta;
  let title: Title;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [Meta, Title],
    }).compileComponents();

    meta = TestBed.inject(Meta);
    title = TestBed.inject(Title);

    component = new Dashboard(meta, title);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with sidebar closed', () => {
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should toggle sidebar state', () => {
    expect(component.isSidebarOpen()).toBe(false);
    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(true);
    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should close sidebar on navigation', () => {
    component.isSidebarOpen.set(true);
    component.onNavigate();
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should set correct meta tags on init', () => {
    const addTagSpy = jest.spyOn(meta, 'addTag');
    const setTitleSpy = jest.spyOn(title, 'setTitle');

    component.ngOnInit();

    expect(setTitleSpy).toHaveBeenCalledWith('SkillDev - Dashboard');
    expect(addTagSpy).toHaveBeenCalledTimes(2);

    expect(addTagSpy).toHaveBeenCalledWith({
      name: 'description',
      content: 'Your SkillDev dashboard to track progress.',
    });

    expect(addTagSpy).toHaveBeenCalledWith({
      name: 'keywords',
      content: 'dashboard, skills, tracking, development',
    });
  });
});
