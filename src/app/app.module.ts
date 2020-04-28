import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { View1Component } from './view1/view1.component';
import { View2Component } from './view2/view2.component';
import { View3Component } from './view3/view3.component';
import { CSVRecord } from './csvrecord/csvrecord.component';

import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { CSVRecord1 } from './csvrecord/cvsrecord1.component';
import {MatTableModule} from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CSVRecord3 } from './csvrecord/csvRecord3.component';
//import {Chart} from 'chart.js';
//import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    View1Component,
    View2Component,
    View3Component,
    CSVRecord,
    CSVRecord1,
    CSVRecord3
   // MenuComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    MatSortModule, BrowserAnimationsModule, 
    MatTableModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
