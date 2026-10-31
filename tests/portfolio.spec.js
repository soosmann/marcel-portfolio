import { test, expect } from "@playwright/test";
import { profile, sections } from "../src/data/portfolio.js";

const errors = [];
test.beforeEach(async ({ page }) => {
  errors.length = 0;
  page.on("pageerror", (error) => errors.push(error.message));
});
test.afterEach(() => expect(errors).toEqual([]));

test("shows Marcel's portfolio, Limpio, and the working contact links", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Marcel Hofmann | Portfolio");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("marcel");
  await expect(page.locator("main > section")).toHaveCount(5);
  await expect(page.locator("main h2")).toHaveText(["/ about me", "/ experience", "/ software projects", "/ products"]);
  await expect(page.getByRole("heading", { name: "Limpio", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "mailto:marcel@hofmann-owl.de");
  const limpioLink = page.locator("#products").getByRole("link", { name: "Visit Limpio" });
  await expect(limpioLink).toBeVisible();
  await expect(limpioLink).toHaveAttribute("href", "https://limpio-app.com");
  await expect(page.getByRole("navigation").getByRole("link")).toHaveCount(7 + Number(Boolean(profile.github)) + Number(Boolean(profile.linkedin)));
  await expect(page.locator(".game-toggle-fixed, .robot-game-canvas, #art, #hardware-projects")).toHaveCount(0);
  for (const image of await page.locator("img").all()) {
    if (!(await image.isVisible())) continue;
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  for (const link of await page.locator('a[href^="#"]:not([href="#"])').all()) {
    const id = (await link.getAttribute("href")).slice(1);
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("desktop.png"), fullPage: true });
});

test("renders ASCII characters from the configured portrait", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const imageResponse = page.waitForResponse((response) => response.url().endsWith(sections[0].portrait.src));
  await page.goto("/");
  expect((await imageResponse).ok()).toBe(true);
  const portrait = page.getByRole("img", { name: /rendered in ASCII/ });
  await expect(portrait).toBeVisible();
  await expect.poll(() => portrait.evaluate((canvas) => {
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let nonempty = 0;
    for (let index = 3; index < pixels.length; index += 4) if (pixels[index] > 0) nonempty++;
    return nonempty;
  })).toBeGreaterThan(500);
  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.reload();
  expect(requests.some((url) => /me2?\.jpg|profile\.png|asciiData/.test(url))).toBe(false);
});

test("experience tabs support clicks and keyboard navigation", async ({ page }) => {
  await page.goto("/#experience");
  const roles = sections.find((section) => section.type === "experience").items;
  await page.getByRole("tab", { name: roles[1].company, exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(roles[1].role);
  await expect(page.getByRole("tab", { name: roles[1].company, exact: true })).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("tabpanel")).toContainText(roles[0].role);
});

test("mobile navigation closes after selection and the layout fits narrow screens", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("navigation").getByRole("link", { name: "Software projects" }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#portfolio-navigation")).not.toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("mobile.png"), fullPage: true });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("section configuration supports hiding, reordering, and adding sections", async ({ page }) => {
  const configuredSections = structuredClone(sections);
  configuredSections.find((section) => section.id === "products").enabled = false;
  const about = configuredSections.splice(1, 1)[0];
  configuredSections.push(about);
  const extraProjects = structuredClone(configuredSections.find((section) => section.id === "projects"));
  extraProjects.id = "more-projects";
  extraProjects.title = "more projects";
  extraProjects.navLabel = "More projects";
  configuredSections.push(extraProjects);
  await page.route("**/src/data/portfolio.js*", (route) => route.fulfill({
    contentType: "text/javascript",
    body: `export const profile = ${JSON.stringify(profile)}; export const sections = ${JSON.stringify(configuredSections)};`,
  }));
  await page.goto("/");
  await expect(page.locator("main > section")).toHaveCount(5);
  expect(await page.locator("main > section").evaluateAll((elements) => elements.map((element) => element.id)))
    .toEqual(["intro", "experience", "projects", "about", "more-projects"]);
  await expect(page.locator('a[href="#products"]')).toHaveCount(0);
  await expect(page.getByRole("navigation").getByRole("link", { name: "More projects" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "/ more projects" })).toBeVisible();
});

test("groups project images first, preserves each group's order, and supports the carousel", async ({ page }) => {
  const configuredSections = structuredClone(sections);
  const projects = configuredSections.find((section) => section.id === "projects");
  const featured = projects.items[0];
  const plain = { ...projects.items[1], image: null, video: null };
  projects.items = [
    { ...plain, id: "plain-first", title: "Plain first" },
    { ...featured, id: "image-first", title: "Image first" },
    { ...plain, id: "plain-second", title: "Plain second", image: { src: "" } },
    { ...featured, id: "image-second", title: "Image second" },
  ];
  await page.route("**/src/data/portfolio.js*", (route) => route.fulfill({
    contentType: "text/javascript",
    body: `export const profile = ${JSON.stringify(profile)}; export const sections = ${JSON.stringify(configuredSections)};`,
  }));
  await page.goto("/#projects");
  const section = page.locator("#projects");
  await expect(section.locator(".featured-project .project-title")).toHaveText(["Image first", "Image second"]);
  await expect(section.locator(".projects-grid .project-title")).toHaveText(["Plain first", "Plain second"]);
  await expect(section.getByRole("heading", { name: "Image first", exact: true })).toBeVisible();
  await section.getByRole("button", { name: "Next", exact: true }).click();
  await expect(section.getByRole("heading", { name: "Image second", exact: true })).toBeVisible();
  await expect(section.getByRole("heading", { name: "Image first", exact: true })).not.toBeVisible();
  await section.getByRole("button", { name: "Show Image first", exact: true }).click();
  await expect(section.getByRole("heading", { name: "Image first", exact: true })).toBeVisible();

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(section.locator(".featured-projects-list .project-title")).toHaveText(["Image first", "Image second"]);
  await expect(section.getByRole("button", { name: "Next", exact: true })).toHaveCount(0);
  await expect(section.getByRole("heading", { name: "Image second", exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  projects.items = [{ ...featured }];
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload();
  await expect(section.locator(".other-projects")).toHaveCount(0);
  await expect(section.getByRole("button", { name: "Next", exact: true })).toHaveCount(0);
  projects.items = [{ ...plain }];
  await page.reload();
  await expect(section.locator(".featured-projects")).toHaveCount(0);
  await expect(section.locator(".projects-grid .project-title")).toHaveText([plain.title]);
});

test("featured videos play and pause when hidden, on desktop and mobile", async ({ page }) => {
  const configuredSections = structuredClone(sections);
  const projects = configuredSections.find((section) => section.id === "projects");
  const videoProject = projects.items.find((project) => project.video?.src);
  const imageProject = projects.items.find((project) => project.image?.src);
  projects.items = [videoProject, imageProject];
  await page.route("**/src/data/portfolio.js*", (route) => route.fulfill({
    contentType: "text/javascript",
    body: `export const profile = ${JSON.stringify(profile)}; export const sections = ${JSON.stringify(configuredSections)};`,
  }));
  await page.goto("/#projects");
  const video = page.locator("#projects video");
  await video.scrollIntoViewIfNeeded();
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute("controls", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).not.toHaveAttribute("autoplay");
  await video.evaluate((element) => { element.muted = true; return element.play(); });
  await expect.poll(() => video.evaluate((element) => element.currentTime)).toBeGreaterThan(0);
  await page.locator("#projects").getByRole("button", { name: "Next", exact: true }).click();
  await expect(video).not.toBeVisible();
  await expect.poll(() => video.evaluate((element) => element.paused)).toBe(true);

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.locator(".featured-projects-list video")).toBeVisible();
  await video.scrollIntoViewIfNeeded();
  await expect(video).toBeVisible();
  await video.evaluate((element) => { element.muted = true; return element.play(); });
  await expect.poll(() => video.evaluate((element) => element.currentTime)).toBeGreaterThan(0);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((element) => element.paused)).toBe(true);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("project previews stay inside their media area without covering text", async ({ page }) => {
  const configuredSections = structuredClone(sections);
  const projects = configuredSections.find((section) => section.id === "projects");
  projects.items = [
    { ...projects.items.find((project) => project.image?.src), id: "image-preview", title: "Image preview" },
    { ...projects.items.find((project) => project.video?.src), id: "video-preview", title: "Video preview" },
  ].map((project) => ({ ...project, description: project.description.repeat(3) }));
  await page.route("**/src/data/portfolio.js*", (route) => route.fulfill({
    contentType: "text/javascript",
    body: `export const profile = ${JSON.stringify(profile)}; export const sections = ${JSON.stringify(configuredSections)};`,
  }));
  await page.goto("/#projects");
  for (const width of [1440, 900, 701, 700, 375]) {
    await page.setViewportSize({ width, height: 1000 });
    if (width <= 700) await expect(page.locator(".featured-projects-list")).toBeVisible();
    else await expect(page.locator(".featured-carousel")).toBeVisible();
    for (const project of projects.items) {
      if (width > 700) {
        await page.getByRole("button", { name: `Show ${project.title}`, exact: true }).click();
      }
      const card = page.locator(".featured-project").filter({
        has: page.getByRole("heading", { name: project.title, exact: true }),
      });
      await expect(card).toBeVisible();
      const media = await card.locator(".project-image").boundingBox();
      const content = await card.locator(".project-details").boundingBox();
      const preview = await card.locator(".project-image img, .project-image video").boundingBox();
      if (width > 700) expect(media.x + media.width).toBeLessThanOrEqual(content.x + 1);
      else expect(media.y + media.height).toBeLessThanOrEqual(content.y + 1);
      expect(Math.abs(preview.width - media.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(preview.height - media.height)).toBeLessThanOrEqual(1);
    }
  }
});
