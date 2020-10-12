import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAgentComponent } from './order-agent.component';

describe('OrderAgentComponent', () => {
  let component: OrderAgentComponent;
  let fixture: ComponentFixture<OrderAgentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAgentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
