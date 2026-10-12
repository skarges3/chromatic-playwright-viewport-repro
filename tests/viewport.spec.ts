import { test, expect } from '@chromatic-com/playwright'

// The page sets an element's width from window.innerWidth in JS. CSS media queries can't
// reproduce that, so the archived DOM differs between the two projects' viewports.
test('JS-sized element', async ({ page }) => {
  await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>
    <div id="box" style="background:#ccc;height:50px"></div>
    <script>
      const box = document.getElementById('box')
      box.style.width = window.innerWidth + 'px'
      box.textContent = 'width set by JS: ' + window.innerWidth
    </script></body></html>`)
  await expect(page.locator('#box')).toBeVisible()
})
