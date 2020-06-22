import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialloadComponent } from './initialload.component';

describe('InitialloadComponent', () => {
  let component: InitialloadComponent;
  let fixture: ComponentFixture<InitialloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
