import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoadingService } from 'src/app/model/service/loading.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) { 
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.setLoading(true, request.url);
    return next.handle(request)
      .pipe(catchError((err) => {
        this.loadingService.setLoading(false, request.url);
        this.openSnackBar();
        return err;
      }))
      .pipe(map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loadingService.setLoading(false, request.url);
        }
        return evt;
      }));
  }

  private openSnackBar() {
    this.snackBar.open(
      this.translateService.instant('error.title') + '! ' + this.translateService.instant('error.tryAgain'), 
      'x', {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      panelClass: ['error-bar'],
    });
  }

  
}