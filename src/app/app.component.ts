import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs/operators';
import { LoadingService } from './model/service/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  loading:boolean = false;
  constructor(
    private translateService: TranslateService,
    private loadingService: LoadingService) {
    translateService.setDefaultLang('en');
  }

  ngOnInit() {
    this.listenToLoading();
  }

  listenToLoading(): void {
    this.loadingService.loadingSub
      .pipe(delay(0)) 
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

}
