import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SofiaComponent } from './sofia.component';

describe('SofiaComponent', () => {
  let component: SofiaComponent;
  let fixture: ComponentFixture<SofiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SofiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SofiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
