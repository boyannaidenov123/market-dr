import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarnaComponent } from './varna.component';

describe('VarnaComponent', () => {
  let component: VarnaComponent;
  let fixture: ComponentFixture<VarnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
