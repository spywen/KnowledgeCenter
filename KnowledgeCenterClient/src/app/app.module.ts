import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { ConfigurationsService, configurationLoaderFactory } from './shared/services/configurations.service';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    BrowserModule,
    AnimationModule(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    ConfigurationsService,
    { provide: APP_INITIALIZER, useFactory: configurationLoaderFactory, deps: [ConfigurationsService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function AnimationModule(): any {
  return environment.enableAnimations ? BrowserAnimationsModule : NoopAnimationsModule;
}
