import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItgrcComponent } from './itgrc.component';

describe('ItgrcComponent', () => {
  let component: ItgrcComponent;
  let fixture: ComponentFixture<ItgrcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItgrcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItgrcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
