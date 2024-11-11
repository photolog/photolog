import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotologLightboxComponent } from './lightbox.component';

describe('PhotologComponent', () => {
  let component: PhotologLightboxComponent;
  let fixture: ComponentFixture<PhotologLightboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotologLightboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotologLightboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
