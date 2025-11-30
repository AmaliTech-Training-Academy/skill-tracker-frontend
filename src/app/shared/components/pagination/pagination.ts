import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';

const MAX_VISIBLE_PAGES = 7;
const FIRST_PAGE = 1;
const MIN_PAGES_FOR_ELLIPSIS = 4;
const ELLIPSIS_THRESHOLD = 3;
const PAGE_RANGE = 1;
const MIN_TOTAL_PAGES = 1;

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  public paginationData = input.required<PaginationData>();
  public pageChanged = output<number>();

  public readonly pageNumbers = computed(() => {
    const { currentPage, totalPages } = this.paginationData();

    if (totalPages <= MAX_VISIBLE_PAGES) {
      return Array.from({ length: totalPages }, (_, i) => i + FIRST_PAGE);
    }

    return this.buildComplexPagination(currentPage, totalPages);
  });

  private buildComplexPagination(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [FIRST_PAGE];

    if (currentPage > MIN_PAGES_FOR_ELLIPSIS) {
      pages.push('...');
    }

    const start = Math.max(FIRST_PAGE + 1, currentPage - PAGE_RANGE);
    const end = Math.min(totalPages - 1, currentPage + PAGE_RANGE);

    for (let i = start; i <= end; i++) {
      if (i !== FIRST_PAGE && i !== totalPages) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - ELLIPSIS_THRESHOLD) {
      pages.push('...');
    }

    if (totalPages > MIN_TOTAL_PAGES) {
      pages.push(totalPages);
    }

    return pages;
  }

  public readonly canGoPrevious = computed(() => this.paginationData().currentPage > FIRST_PAGE);

  public readonly canGoNext = computed(() => {
    const { currentPage, totalPages } = this.paginationData();
    return currentPage < totalPages;
  });

  public onPageClick(page: number | string): void {
    if (typeof page === 'number') {
      this.pageChanged.emit(page);
    }
  }

  public onPrevious(): void {
    if (this.canGoPrevious()) {
      this.pageChanged.emit(this.paginationData().currentPage - FIRST_PAGE);
    }
  }

  public onNext(): void {
    if (this.canGoNext()) {
      this.pageChanged.emit(this.paginationData().currentPage + FIRST_PAGE);
    }
  }
}
