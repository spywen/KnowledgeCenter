import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [RouterModule],
  bootstrap: [HomeComponent]
})
export class HomeModule { }
