# Lightbox

![Photolog image gallery with routed lightbox](../../assets/default-cover-animated.avif)

[Live Demo](https://photolog.dev "Link to see Photolog components in action")

Create lightbox experiences with smooth transitions between preview images and their routed, full-screen views.

**Key Features:**

- **60fps Single-Document Transitions**

    Seamlessly animates photos as they transition between routes with 60fps performance.

- **Dynamic Slide Animation**

    Smoothly scales images to fit the viewport.

- **Responsive Design**:

    Maintains aspect ratio while fitting images within the viewport.

- **SEO-friendly**

    Enhanced search engine optimization through route-based navigation (avoiding hash fragments, which aren't crawled by search engines).

- **Precise Element Positioning**:

    Utilities to calculate element positions relative to the viewport.

> **IMPORTANT NOTICE**
>
> This library uses the experimental [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) and therefore animated transitions will only work in [supported browsers](https://caniuse.com/view-transitions)
> until I implement a proper fallback mechanism for the same behavior.

## Running unit tests

To execute unit tests for this project, run:

```bash
pnpm exec nx test layout
```
