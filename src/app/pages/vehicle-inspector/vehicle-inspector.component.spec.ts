import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleInspectorComponent } from './vehicle-inspector.component';

describe('VehicleInspectorComponent', () => {
  let component: VehicleInspectorComponent;
  let fixture: ComponentFixture<VehicleInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleInspectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
