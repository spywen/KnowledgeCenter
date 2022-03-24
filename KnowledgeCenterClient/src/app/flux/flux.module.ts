import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FluxComponent } from './flux.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FluxService, PublicationResolver } from './services/flux.service';
import { HotkeyModule } from 'angular2-hotkeys';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteDialogComponent } from '../shared/components/delete-dialog/delete-dialog.component';

const routes: Routes = [
  { path: '',
    component: FluxComponent,
    data: {
      title: 'Flux'
    },
    resolve: { data: PublicationResolver }
  }
];

@NgModule({
  entryComponents: [
    FluxComponent,
    DeleteDialogComponent],
  declarations: [FluxComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HotkeyModule.forRoot()
  ],
  exports: [RouterModule],
  providers: [
    FluxService,
    PublicationResolver
  ]
})
export class FluxModule { }
