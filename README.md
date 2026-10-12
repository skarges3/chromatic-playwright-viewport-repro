# @chromatic-com/playwright 1.0.0: story-level `globals.viewport` overrides the per-viewport modes

Minimal reproduction. Needs Node 22+.

```sh
npm install
npm run install:browser     # one-off: downloads Chromium for Playwright (also used by the check)

npm run repro:fixture       # quickest: build + check from the committed archive in fixture/
npm run repro               # same, but re-runs the Playwright capture first
npm run repro:workaround    # same as repro:fixture, with the story-level globals removed
npm run serve               # prints URLs to look at each mode in a browser by hand
```

`repro:fixture` should end with:

```
FAIL  mode w1280h720        <- desktop mode fetched the *mobile* snapshot
      snapshot file used: …w393h727.snapshot.json
PASS  mode w393h727
```

and `repro:workaround` with `PASS` for both modes.

## What is in here

- `playwright.config.ts`: two projects with different viewports (Desktop 1280x720, Pixel 5).
- `tests/viewport.spec.ts`: one test whose page sets an element's width from `window.innerWidth` in JS, so the captured DOM differs by viewport in a way CSS media queries can't hide.
- `fixture/chromatic-archives/`: what `npm run capture` produced (two snapshot files and one `stories.json`, ~12 KB). `npm run repro:fixture` uses it so you can skip the Playwright run.
- `render.mjs`: renders the built archive Storybook once per mode and checks which snapshot file was fetched.
- `strip-globals.mjs`: the workaround.

The capture runs with `--workers=1` because two workers write the same `stories.json` at once (see the issue).
