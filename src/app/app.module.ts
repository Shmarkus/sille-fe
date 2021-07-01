import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ApiModule, Configuration } from './services/api/backend-client';
import {environment} from '../environments/environment';
import {HttpClientModule} from '@angular/common/http';

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
    ApiModule.forRoot(apiModuleConfigurationFactory)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
