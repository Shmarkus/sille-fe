import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ApiModule, Configuration } from './services/api/backend-client';
import {environment} from '../environments/environment';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {ErrorHandlerInterceptor} from './services/interceptor/errorhandler.interceptor';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";

export function apiModuleConfigurationFactory(): Configuration {
  return new Configuration({
    basePath: environment.serverUrl
  });
}
@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ApiModule.forRoot(apiModuleConfigurationFactory),
        NgbModule,
        ToastrModule.forRoot(), // ToastrModule added
        BrowserAnimationsModule,
        FormsModule,
        // ToastrModule required animations module
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
