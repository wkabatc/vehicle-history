import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddOwnerComponent } from './components/add-owner/add-owner.component';
import { AddVehicleComponent } from './components/add-vehicle/add-vehicle.component';
import { VehicleReportComponent } from './pages/vehicle-report/vehicle-report.component';
import { VehicleInspectorComponent } from './pages/vehicle-inspector/vehicle-inspector.component';
import { PoliceComponent } from './pages/police/police.component';
import { InsurerComponent } from './pages/insurer/insurer.component';
import { RegistrationOfficeComponent } from './pages/registration-office/registration-office.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { OptionsFormComponent } from './components/options-form/options-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { FormatTimestampPipe } from './pipes/format-timestamp.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AddOwnerComponent,
    AddVehicleComponent,
    VehicleReportComponent,
    VehicleInspectorComponent,
    PoliceComponent,
    InsurerComponent,
    RegistrationOfficeComponent,
    OptionsFormComponent,
    ImageGalleryComponent,
    LineChartComponent,
    FormatTimestampPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
