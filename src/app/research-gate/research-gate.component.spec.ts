import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchGateComponent } from './research-gate.component';

describe('ResearchGateComponent', () => {
  let component: ResearchGateComponent;
  let fixture: ComponentFixture<ResearchGateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResearchGateComponent]
    });
    fixture = TestBed.createComponent(ResearchGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
