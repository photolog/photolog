import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JustifiedLayoutComponent } from './justified-layout.component';

describe('JustifiedLayoutComponent', () => {
  let component: JustifiedLayoutComponent;
  let fixture: ComponentFixture<JustifiedLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustifiedLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JustifiedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
