import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationOfficeComponent } from './pages/registration-office/registration-office.component';
import { VehicleInspectorComponent } from './pages/vehicle-inspector/vehicle-inspector.component';
import { PoliceComponent } from './pages/police/police.component';
import { InsurerComponent } from './pages/insurer/insurer.component';
import { VehicleReportComponent } from './pages/vehicle-report/vehicle-report.component';

const routes: Routes = [
  { path: '', component: RegistrationOfficeComponent },
  { path: 'registration-office', component: RegistrationOfficeComponent },
  { path: 'vehicle-inspector', component: VehicleInspectorComponent },
  { path: 'police', component: PoliceComponent },
  { path: 'insurer', component: InsurerComponent },
  { path: 'vehicle-report', component: VehicleReportComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
