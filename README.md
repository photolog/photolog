# Photolog
>
> This project is still in the experimental stage and may introduce breaking changes without notice.

![Photolog image gallery with routed lightbox](assets/default-cover-animated.avif)

[Live Demo](https://photolog.dev "Link to see Photolog components in action")

This repository contains components and utilities for building dynamic, responsive, and visually engaging photo-viewing experiences in Angular.

## Table of Contents

- [Packages](#packages)
- [Installation](#installation)
- [Local development](#local-development)
- [Contributing](#contributing)
- [License](#license)

## Packages

> All packages can be used as standalone.

- [Core](#core)
- [Layout](#layout)
- [Lightbox](#lightbox)

### Core

Provides core utilities shared by all packages.

### Layout

Generate and render aesthetically pleasing image layouts by organizing images into rows of equal height, delivering a clean and cohesive look for image galleries.

![Photolog image layout](assets/photolog-layout.avif)

**Key Features:**

- **Justified Layout**

    Automatically arranges images into rows of equal height for a polished and balanced design.

- **Flexible Configuration**

    Fine-tune row height, tolerance, spacing, and other parameters to suit your needs.

- **60fps Scrolling**

    Optimized for 60fps scrolling and efficiently handles large sets of images thanks to deferrable views.

> For now, this library uses [flickr's justified-layout](https://flickr.github.io/justified-layout/) package under the hood. But I am interested in removing this dependency entirely and replace it a with built-in, tailored solution.

### Lightbox

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
> The [Lightbox](#lightbox) library uses the experimental [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) and therefore animated transitions will only work in [supported browsers](https://caniuse.com/view-transitions)
> until I implement a proper fallback mechanism.

## Installation

TBD

## Local development

This repository is a [nx](https://nx.dev/getting-started/intro) workspace and uses [pnpm]((https://pnpm.io)) as package manager. If you don't have **pnpm** installed yet, follow these [install instructions](https://pnpm.io/installation)

Optionally, you may also [install the nx CLI globally](https://nx.dev/getting-started/installation#installing-nx-globally). This allows you to replace the `pnpm exec nx` part of each command with `nx`. For example `pnpm exec nx serve app` would become `nx serve app`.

### Clone repository

#### With Git

```bash
git clone photolog/photolog
```

#### With GitHub CLI

```bash
gh repo clone photolog/photolog
```

### List all workspace packages

```bash
pnpm exec nx show projects
```

### Start playground application

The playground application contains code for the [live demo site](https://photolog.dev).

To run it in development mode, use:

```bash
pnpm exec nx serve playground
```

To run it in SSR (server-side rendering) mode, use:

```bash
pnpm exec nx serve-ssr playground
```

### Running unit tests

All workspace packages, including the **playground** app, use Jest as the test runner.

#### Test only what changed

This command compares the current state of this workspace (git HEAD) with the base branch (main) and only runs tests if the state changed.

```bash
pnpm exec nx affected -t test
```

#### Test workspace  

```bash
pnpm exec nx run-many -t test
```

#### Test Photolog feature  

```bash
# Test layout feature
pnpm exec nx test layout

# Test lightbox feature
pnpm exec nx test lightbox
```

#### Test all Photolog features

```bash
pnpm exec nx run-many -t test --projects=tag:type:feature
```

### Linting

All packages use ESLint to enforce coding standards across the workspace.

#### Lint only what changed

```bash
pnpm exec nx affected -t test
```

#### Lint workspace

```bash
pnpm exec nx run-many -t lint
```

#### Lint Photolog feature

```bash
pnpm exec nx lint layout
```

#### Lint all Photolog feature

```bash
pnpm exec nx run-many -t lint --projects=tag:type:feature
```

### Formatting

To format the workspace, use:

```bash
pnpm exec nx format
```

## Contributing

If you'd like to improve this project, please feel free to:

- [Open an issue](https://github.com/photolog/photolog/issues/new) to report bugs or suggest features.
- Fork the repository, make your changes, and submit a pull request.

Submitting a pull request involes using common workspace tasks as discussed in the [Local development](#local-development) section.

> **Note**
>
> This repository uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/), so you must make sure your commit messages adhere to this specification.

Here is a minimal example, assuming your fork lives at `https://github.com/username/photolog.git`:

### 1. clone repository

```bash
git clone https://github.com/username/photolog.git
```

```bash
cd ./photolog
```

```bash
git checkout -b fix-typos-in-interface
```

### 2. Make your changes

> If your changes ***are not purely descriptive*** (e.g documentation, spelling errors, refactoring), you must add tests for these changes.

Before:

```ts
/** Represents th siz of a 2D box */
export interface Dimensions {
  width: number;
  height: number;
}
```

After:

```ts
/** Represents the size of a 2D box */
export interface Dimensions {
  width: number;
  height: number;
}
```

#### 3. Lint, test and build workspace

```bash
pnpm exec nx affected -t lint test build
```

#### 4. Commit your changes

```bash
git add .
```

```bash
git commit -m "docs(core): fix typos in Dimensions interface"
```

#### 5. Push your changes

```bash
git push origin fix-typos-in-interface
```

Then go back to [original repository](https://github.com/photolog/photolog) on GitHub and click on **Compare & pull request** prompt.

## License

This project is licensed under the [Apache License 2.0](./LICENSE).

You are free to use, modify, and distribute this software, provided you adhere to the terms of the license.
