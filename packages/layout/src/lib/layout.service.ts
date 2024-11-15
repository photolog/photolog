import { inject, Injectable } from '@angular/core';
import { deepMerge } from '@photolog/core';
import createJustifiedLayout from 'justified-layout';

import { PHOTOLOG_LAYOUT_CONFIG } from './layout.tokens';
import { LayoutItem, LayoutOptions, LayoutResult } from './types';

/**
 * Configuration object for generating a justified layout.
 * @template I - The type of item data, extending `PhotologLayoutItem`.
 */
export type GenerateLayoutConfig<I extends LayoutItem> =
  Partial<LayoutOptions> & {
    /** Width of the container for layout calculation */
    containerWidth: number;
    /** Array of items to include in the layout */
    items: I[];
  };

@Injectable()
export class LayoutService {
  /**
   * Optional layout configuration token that provides default layout options.
   */
  private readonly config = inject(PHOTOLOG_LAYOUT_CONFIG, { optional: true });

  /**
   * Generates a justified layout based on the provided configuration and items.
   * @template I - The type of item data, extending `PhotologLayoutItem`.
   * @param GenerateLayoutConfig<I> - Configuration options for the layout generation.
   * @returns PhotologLayoutResult<I> - The generated layout with box dimensions and positions.
   */
  generateLayout<I extends LayoutItem>({
    items: layoutItems,
    containerWidth,
    ...options
  }: GenerateLayoutConfig<I>): LayoutResult<I> {
    // Merge user options with any default configuration from the injected token
    const mergedConfig = deepMerge(this.config ?? {}, options);
    const config = { ...mergedConfig, containerWidth };

    const { boxes, containerHeight, widowCount } = createJustifiedLayout(
      layoutItems,
      config,
    );

    // Map each box in the layout result to its corresponding item
    const items = boxes.map((box, index) => ({
      data: layoutItems[index],
      box,
    }));

    return { items, containerHeight, widowCount };
  }
}
