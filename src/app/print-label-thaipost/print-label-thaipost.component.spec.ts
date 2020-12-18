import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintLabelThaipostComponent } from './print-label-thaipost.component';

describe('PrintLabelThaipostComponent', () => {
  let component: PrintLabelThaipostComponent;
  let fixture: ComponentFixture<PrintLabelThaipostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintLabelThaipostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintLabelThaipostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
