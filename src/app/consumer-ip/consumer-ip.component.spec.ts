import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerIpComponent } from './consumer-ip.component';

describe('ConsumerIpComponent', () => {
  let component: ConsumerIpComponent;
  let fixture: ComponentFixture<ConsumerIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerIpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsumerIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
