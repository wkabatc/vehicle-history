import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationOfficeComponent } from './registration-office.component';

describe('RegistrationOfficeComponent', () => {
  let component: RegistrationOfficeComponent;
  let fixture: ComponentFixture<RegistrationOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationOfficeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
