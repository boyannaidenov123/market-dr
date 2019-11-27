import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListCreateComponent } from './product-list-create.component';

describe('ProductListCreateComponent', () => {
  let component: ProductListCreateComponent;
  let fixture: ComponentFixture<ProductListCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
