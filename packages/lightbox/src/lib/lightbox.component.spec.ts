import { DOCUMENT } from '@angular/common';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PhotologImage } from '@photolog/core';
import { AnimationVisibilityState } from './lightbox.animationts';
import { LightboxComponent, WITH_PHOTOLOG_CSS } from './lightbox.component';

describe('PhotologComponent', () => {
  let component: LightboxComponent;
  let componentRef: ComponentRef<LightboxComponent>;
  let fixture: ComponentFixture<LightboxComponent>;
  const photologImage: PhotologImage = {
    id: '529',
    author: 'Jeff Sheldon',
    width: 4000,
    height: 3000,
    src: 'https://picsum.photos/id/529/4000/3000.webp',
    aspectRatio: 1.3333333333333333,
    alt: 'A photo by Jeff Sheldon used as an example in an Angular Lightbox',
    caption: 'Photo by Jeff Sheldon on Unsplash',
    page: 21,
    thumbnail: {
      src: 'https://picsum.photos/id/529/360/270.webp',
      height: 270,
      width: 360,
    },
  };

  beforeEach(async () => {
    const testBed = TestBed.configureTestingModule({
      imports: [LightboxComponent, NoopAnimationsModule],
    });
    await testBed.compileComponents();

    fixture = TestBed.createComponent(LightboxComponent);

    componentRef = fixture.componentRef;
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should have no slides initialized when no photo was set as input', async () => {
    const activeSlide = component.activeSlide();
    expect(activeSlide).toBeNull();
    const slides = component.state.slides();
    expect(slides).toBeInstanceOf(Array);
    expect(slides.length).toEqual(0);
  });

  it('should have initialized exactly 1 slide when photo input changed', async () => {
    componentRef.setInput('images', [photologImage]);
    componentRef.setInput('activeIndex', 0);

    fixture.detectChanges();
    await fixture.whenStable();

    const activeSlide = component.activeSlide();
    const slides = component.state.slides();
    expect(activeSlide?.data).toMatchObject(photologImage);
    expect(slides).toBeInstanceOf(Array);
    expect(slides.length).toEqual(1);
  });

  // TODO: This is probably useless to test write now because we use `NoopAnimationsModule`
  it('should have animation state value of "hidden" before rendering in the browser', async () => {
    // NOTE: We use `NoopAnimationsModule`, therefore our animation state will be `visible` by default.
    component.animationState.set(AnimationVisibilityState.Hidden);
    await fixture.whenStable();
    let animationState = component.animationState();
    expect(animationState).toBe(AnimationVisibilityState.Hidden);

    component.animationState.set(AnimationVisibilityState.Visible);
    await fixture.whenStable();
    animationState = component.animationState();
    expect(animationState).toBe(AnimationVisibilityState.Visible);
  });

  it('should have lightbox css classes applied to html tag', async () => {
    await fixture.whenRenderingDone();
    const doc = TestBed.inject(DOCUMENT);
    const rootDocElem = doc.documentElement;
    const hasLightboxCss = rootDocElem.classList.contains(WITH_PHOTOLOG_CSS);
    expect(hasLightboxCss).toBe(true);
  });

  it('should hide and navigate back when closed', async () => {
    await fixture.whenRenderingDone();
    await component.close();
    await fixture.whenStable();
    expect(component.animationState()).toBe(AnimationVisibilityState.Hidden);
    expect(component.isOpened()()).toBe(false);
  });

  it('should have lightbox css classes removed from html tag when closed', async () => {
    const doc = TestBed.inject(DOCUMENT);
    fixture.destroy();
    const rootDocElem = doc.documentElement;
    const hasLightboxCss = rootDocElem.classList.contains(WITH_PHOTOLOG_CSS);
    expect(hasLightboxCss).toBe(false);
  });
});
