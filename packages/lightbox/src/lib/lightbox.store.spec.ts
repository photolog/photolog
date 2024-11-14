import { TestBed } from '@angular/core/testing';
import { LightboxSlidesState, LightboxState } from './lightbox.store';
import { PartialImageSlide } from './slide/slide.interface';

describe('LightboxState Directive', () => {
  let directive: LightboxState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LightboxState],
    });
    directive = TestBed.inject(LightboxState);
  });

  it('should initialize with default state', () => {
    const initialState: LightboxSlidesState = {
      slides: [],
      activeIndex: -1,
    };
    expect(directive.state()).toEqual(initialState);
  });

  it('should activate a slide at a specific index', async () => {
    const mockSlide: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: false,
    };
    await directive.state.append(mockSlide);
    await directive.state.activate({ index: 0 });

    const state = directive.state();
    expect(state.slides[0].active).toBe(true);
    expect(state.activeIndex).toBe(0);
  });

  it('should deactivate a slide at a specific index', async () => {
    const mockSlide: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: true,
    };
    directive.state.append(mockSlide);
    await directive.state.deactivate({ index: 0 });
    const state = directive.state();
    expect(state.slides[0].active).toBeFalsy();
    expect(state.activeIndex).toBe(-1);
  });

  it('should append a new slide', async () => {
    const mockSlide: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: false,
    };
    await directive.state.append(mockSlide);
    const state = directive.state();
    expect(state.slides.length).toBe(1);
    expect(state.slides[0]).toEqual(mockSlide);
  });

  it('should prepend a new slide', async () => {
    const slide1: PartialImageSlide = {
      data: {} as never,
      index: 1,
      active: false,
    };
    const slide2: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: false,
    };
    await directive.state.append(slide1);
    await directive.state.prepend(slide2);

    const state = directive.state();
    expect(state.slides.length).toBe(2);
    expect(state.slides[0]).toEqual(slide2);
  });

  it('should update a slide by ID', async () => {
    const slide: PartialImageSlide = {
      data: { id: '123' } as never,
      index: 0,
      active: false,
    };
    await directive.state.append(slide);

    await directive.state.updateById({ id: '123', data: { index: 1 } });
    const state = directive.state();
    expect(state.slides[0]?.['index']).toBe(1);
  });

  it('should update a slide at a specific index', async () => {
    const slide: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: false,
    };
    await directive.state.append(slide);
    await directive.state.updateAtIndex({ index: 0, data: { active: true } });
    const state = directive.state();
    expect(state.slides[0].active).toBe(true);
  });

  it('should update the active slide', async () => {
    const slide: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: true,
    };
    await directive.state.append(slide);
    await directive.state.activate({ index: 0 });
    await directive.state.updateActive({ data: { index: 2 } });
    const state = directive.state();
    expect(state.slides[0].index).toBe(2);
  });

  it('should remove a slide by index', async () => {
    const slide: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: false,
    };
    await directive.state.append(slide);
    await directive.state.removeByIndex({ index: 0 });
    const state = directive.state();
    expect(state.slides.length).toBe(0);
  });

  it('should remove a slide by ID', async () => {
    const slide: PartialImageSlide = {
      data: { id: '123' } as never,
      index: 0,
      active: false,
    };
    await directive.state.append(slide);
    await directive.state.removeById({ id: '123' });
    const state = directive.state();
    expect(state.slides.length).toBe(0);
  });

  it('should return the correct count from selector', async () => {
    expect(directive.state.count()).toBe(0);
    await directive.state.append({
      data: {} as never,
      index: 0,
      active: false,
    });
    expect(directive.state.count()).toBe(1);
  });

  it('should return the active slide from selector', async () => {
    const slide: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: true,
    };
    await directive.state.append(slide);
    await directive.state.activate({ index: 0 });
    const activeSlide = directive.state.activeSlide();
    expect(activeSlide).toEqual(slide);
  });

  it('should return the active slide from selector', async () => {
    const slide: PartialImageSlide = {
      data: {} as never,
      index: 0,
      active: true,
    };
    await directive.state.append(slide);
    await directive.state.activate({ index: 0 });
    const activeSlide = directive.state.activeSlide();
    expect(activeSlide).toEqual(slide);
  });
});
