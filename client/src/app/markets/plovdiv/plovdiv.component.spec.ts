import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlovdivComponent } from './plovdiv.component';

describe('PlovdivComponent', () => {
  let component: PlovdivComponent;
  let fixture: ComponentFixture<PlovdivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlovdivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlovdivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
