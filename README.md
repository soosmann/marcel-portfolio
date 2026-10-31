# Marcel Hofmann — portfolio

A personal portfolio built with React and Vite, adapted from [Gazi Jarin's Gazi-V2 template](https://github.com/gazijarin/Gazi-V2).

## Run locally

Requires Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL Vite prints. For production, run `npm run build`; the static site is generated in `dist/`. Use `npm run preview` to check that build locally.

## Edit content and sections

**Start with [`src/data/portfolio.js`](src/data/portfolio.js).** It contains your name, email, social links, introductory copy, about text, experience, software projects, and products. Empty social/project links are hidden.

The `sections` array controls both the page and its navigation:

- **Hide a section:** set `enabled: false` on its object, or remove the object.
- **Change the order:** move its object in the array.
- **Rename a section:** edit `title` (page heading) and `navLabel` (navigation).
- **Add a section of an existing type:** duplicate its object and give it a unique `id`. Supported types are `intro`, `about`, `experience`, `projects`, and `product`.
- **Add an entirely new layout:** create a component, register its `type` in `sectionComponents` in `src/App.jsx`, and add its content to the array. Use `src/components/Section.jsx` for a matching heading and spacing.

Each experience, project, and product also has an `items` array: add or remove objects there to change its entries. Give each item a stable, unique `id`. Experience roles remain explicitly marked placeholders until you supply your work history; remove `isPlaceholder: true` when you fill them in.

The software project's link to Limpio is automatically hidden if the products section is disabled. Update internal links if you rename section IDs.

## Software project hierarchy

Keep all software projects in the same `items` array. A project with `image.src` or `video.src` appears in the featured group at the top; a project without either appears in the card grid below. **Array order is preserved within each group**, even when media and text-only items are interleaved in the configuration.

Featured projects use a manual carousel on desktop and stacked media cards on mobile, like the original template. A single featured project shows without carousel controls. Empty groups are hidden.

To feature a project, add an image object:

```js
image: {
  src: "/assets/my-project.png",
  alt: "Screenshot of my project",
  isPlaceholder: false,
},
```

For a video, add a video object instead:

```js
video: {
  src: "/assets/projects/my-demo.mp4",
  alt: "Demonstration of my project",
  poster: "/assets/projects/my-demo-cover.png",
},
```

Put the actual video in `public/assets/projects/`. Use a browser-playable video file, such as MP4 with H.264 or WebM. MOV playback depends on the codecs in the file and the visitor's browser. Videos have playback controls, play inline on mobile, and pause when their slide or card leaves view. They do not autoplay. An “Open video” link also opens the original file. Optional captions can be added with `captions: { src: "/assets/projects/demo.vtt", language: "en", label: "English" }` inside `video`.

If both `video` and `image` are supplied, the video is displayed and the image is used as its poster unless `video.poster` is set. Remove both fields, set them to `null`, or leave both `src` values empty to put the project back in the card grid. Project images and videos fill their preview rectangle, cropping edges when their proportions differ. The About photo instead uses its natural proportions so the whole image is visible without a surrounding frame.

## Replace the image placeholders

Put your images in `public/assets/` and refer to them with URLs beginning `/assets/` (omit `public`).

1. **Pixel/ASCII portrait:** update `portrait.src`, `portrait.alt`, and `portrait.isPlaceholder` in the intro section. The ASCII effect is generated from that image automatically. A transparent portrait works best; there is no portrait data to regenerate.
2. **About photo:** update `photo.src`, `photo.alt`, and `photo.isPlaceholder` in the about section.
3. **Limpio screenshot:** update `screenshot.src`, `screenshot.alt`, and `screenshot.isPlaceholder` in the product entry. A portrait screenshot around a 1:2 aspect ratio fits the phone frame.

Set `isPlaceholder: false` to remove the corresponding placeholder caption. The ASCII portrait's fallback image is `public/assets/placeholders/portrait.svg`.

## Limpio

The products section includes the supplied app details: image-quality ranking and deletion candidates, a MobileCLIP-based network trained on a self-created dataset, quantization and pruning, on-device learning, Flutter, Drift SQL, and Firebase. Add store or product links to the product's `links` array when ready:

```js
links: [
  { label: "Visit Limpio", url: "https://your-product-url.example" },
],
```

## Browser checks

```sh
npx playwright install chromium
npm test
```

On macOS, the tests can also use an installed Google Chrome. To use another Chromium executable, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.

The checks cover desktop/mobile navigation, experience tabs, email links, image loading, ASCII rendering, and adding, hiding, and reordering sections. `npm run lint` is also available.

## Deployment and styling

Import this repository into Vercel with the repository root as the Root Directory. The included `vercel.json` selects Vite, installs dependencies with `npm ci`, builds with `npm run build`, and publishes `dist/`. Node.js 22 is selected through `package.json`. No environment variables are required.

Navigation uses section anchors, so no SPA route rewrites are needed. Images, videos, and fonts are copied from `public/` into the build output.

The existing GitHub Pages workflow is separate from Vercel and still runs on pushes to `main`.

Colors live in `src/styles/Global.css`, common spacing in `src/App.css`, and individual section styles in `src/styles/`. The NTR font is served locally.

If you later change your name or portfolio description, also update the static metadata in `index.html` and `public/manifest.json`.
