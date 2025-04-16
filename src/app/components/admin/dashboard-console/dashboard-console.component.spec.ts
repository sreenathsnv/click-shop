import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConsoleComponent } from './dashboard-console.component';

describe('DashboardConsoleComponent', () => {
  let component: DashboardConsoleComponent;
  let fixture: ComponentFixture<DashboardConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
