import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { LoadingService } from '../model/service/loading.service';
import { UniversityService } from '../model/service/university.service';
import { UniversityInterface } from '../model/university.type';

@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.scss']
})
export class UniversityComponent implements OnInit, OnDestroy, AfterViewInit {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  filterValueChanged: Subject<string> = new Subject<string>();
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  filterValue = '';
  universityList: UniversityInterface[];
  isLoading: boolean = false;

  //table properties
  dataSource: MatTableDataSource<UniversityInterface> = new MatTableDataSource();
  displayedColumns: string[ ] = ['index', 'name', 'webPages'];
  pageSizeOptions = [10, 20, 50, 100];
  pageSize = 10;
  length = 100;
  pageIndex = 0;

  constructor(private universityService: UniversityService, private loadingService: LoadingService) { }

  ngOnInit() {
    this.listenToLoading();
    this.filterOnChangeInit();
    this.onSearch();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit(): void {   
    this.dataSource.paginator = this.paginator;
  }

  onSearch(): void {
    this.isLoading = true;
    this.universityService.searchUniversity(this.filterValue)
      .pipe(
      takeUntil(this.destroy$.asObservable())).subscribe(res=> {
        this.universityList = res;
        this.dataSource.data = this.universityList;
        this.setPagination(
          res.length,
          this.pageIndex,
          this.pageSize
        );
      },
      () => this.isLoading = false);
  }

  filterOnChangeInit() {
    this.filterValueChanged
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.filterValue = value;
        this.onSearch();
      });
  }

  filterValueOnChange(text: string) {
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.filterValueChanged.next(text);
  }

  updatePageInfo(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
  }

  setPagination(length: number, startIndex: number, pageSize: number) {
    this.length = length;
    this.pageIndex = startIndex;
    this.pageSize = pageSize;
  }

  listenToLoading() {
    this.loadingService.loadingSub
      .pipe(delay(0)) 
      .subscribe((loading) => {
        this.isLoading = loading;
      });
  }

  sortData(sort: Sort) {
    console.log(32);
    const data = this.universityList.slice();
    let sortedData;
    if (!sort.active || sort.direction === '') {
      sortedData = data;
      return;
    }

    sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource.data = sortedData;
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }


}
