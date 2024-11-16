# Layout

![Photolog image layout](../../assets/photolog-layout.avif)

[Live Demo](https://photolog.dev 'Link to see Photolog components in action')

Generate and render aesthetically pleasing image layouts by organizing images into rows of equal height, delivering a clean and cohesive look for image galleries.

**Key Features:**

- **Justified Layout**

  Automatically arranges images into rows of equal height for a polished and balanced design.

- **Flexible Configuration**

  Fine-tune row height, tolerance, spacing, and other parameters to suit your needs.

- **60fps Scrolling**

  Optimized for 60fps scrolling and efficiently handles large sets of images thanks to deferrable views.

> For now, this library uses [flickr's justified-layout](https://flickr.github.io/justified-layout/) package under the hood. But I am interested in removing this dependency entirely and replace it a with built-in, tailored solution.

## Running unit tests

To execute unit tests for this project, run:

```bash
pnpm exec nx test layout
```
