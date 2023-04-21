import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurerComponent } from './insurer.component';

describe('InsurerComponent', () => {
  let component: InsurerComponent;
  let fixture: ComponentFixture<InsurerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsurerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
