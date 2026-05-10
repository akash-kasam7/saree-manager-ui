import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskAnythingComponent } from './ask-anything-component';

describe('AskAnythingComponent', () => {
  let component: AskAnythingComponent;
  let fixture: ComponentFixture<AskAnythingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskAnythingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AskAnythingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
