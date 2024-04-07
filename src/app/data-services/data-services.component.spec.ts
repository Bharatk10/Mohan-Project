import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataServicesComponent } from './data-services.component';

describe('DataServicesComponent', () => {
  let component: DataServicesComponent;
  let fixture: ComponentFixture<DataServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
