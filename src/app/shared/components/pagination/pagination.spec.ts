import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
  });

  describe('pageNumbers computed', () => {
    it('should show all pages when totalPages <= 7', () => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 1,
        totalPages: 5,
        totalElements: 50,
      });

      expect(component.pageNumbers()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should show ellipsis for large page counts', () => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 5,
        totalPages: 20,
        totalElements: 200,
      });

      expect(component.pageNumbers()).toEqual([1, '...', 4, 5, 6, '...', 20]);
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 5,
        totalPages: 10,
        totalElements: 100,
      });
    });

    it('should emit previous page', () => {
      jest.spyOn(component.pageChanged, 'emit');
      component.onPrevious();
      expect(component.pageChanged.emit).toHaveBeenCalledWith(4);
    });

    it('should emit next page', () => {
      jest.spyOn(component.pageChanged, 'emit');
      component.onNext();
      expect(component.pageChanged.emit).toHaveBeenCalledWith(6);
    });

    it('should emit clicked page number', () => {
      jest.spyOn(component.pageChanged, 'emit');
      component.onPageClick(3);
      expect(component.pageChanged.emit).toHaveBeenCalledWith(3);
    });

    it('should not emit for ellipsis click', () => {
      jest.spyOn(component.pageChanged, 'emit');
      component.onPageClick('...');
      expect(component.pageChanged.emit).not.toHaveBeenCalled();
    });
  });

  describe('canGoPrevious', () => {
    it('should return false for first page', () => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 1,
        totalPages: 5,
        totalElements: 50,
      });

      expect(component.canGoPrevious()).toBe(false);
    });

    it('should return true for non-first page', () => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 3,
        totalPages: 5,
        totalElements: 50,
      });

      expect(component.canGoPrevious()).toBe(true);
    });
  });

  describe('canGoNext', () => {
    it('should return false for last page', () => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 5,
        totalPages: 5,
        totalElements: 50,
      });

      expect(component.canGoNext()).toBe(false);
    });

    it('should return true for non-last page', () => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 3,
        totalPages: 5,
        totalElements: 50,
      });

      expect(component.canGoNext()).toBe(true);
    });
  });

  describe('task dashboard integration', () => {
    it('should handle task pagination data correctly', () => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 1,
        totalPages: 3,
        totalElements: 15,
      });

      expect(component.pageNumbers()).toEqual([1, 2, 3]);
      expect(component.canGoPrevious()).toBe(false);
      expect(component.canGoNext()).toBe(true);
    });

    it('should emit correct page for task list navigation', () => {
      fixture.componentRef.setInput('paginationData', {
        currentPage: 2,
        totalPages: 4,
        totalElements: 20,
      });

      jest.spyOn(component.pageChanged, 'emit');

      component.onNext();
      expect(component.pageChanged.emit).toHaveBeenCalledWith(3);

      component.onPrevious();
      expect(component.pageChanged.emit).toHaveBeenCalledWith(1);
    });
  });
});
