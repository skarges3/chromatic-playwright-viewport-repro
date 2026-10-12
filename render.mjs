// Renders the built archive Storybook once per viewport mode and checks which snapshot it used.
// usage: node render.mjs <sb dir> <story id>
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const [root, id] = [path.resolve(process.argv[2]), process.argv[3]]
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' }
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  let file = path.join(root, decodeURIComponent(url.pathname))
  try {
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')
    res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream')
    res.end(fs.readFileSync(file))
  } catch {
    res.statusCode = 404
    res.end()
  }
}).listen(0)
await new Promise((r) => server.on('listening', r))
const port = server.address().port

const browser = await chromium.launch()
let failed = false
for (const { mode, width } of [{ mode: 'w1280h720', width: 1280 }, { mode: 'w393h727', width: 393 }]) {
  const page = await browser.newPage({ viewport: { width, height: 720 } })
  const snapshots = []
  page.on('response', (r) => r.url().includes('.snapshot.json') && snapshots.push(r.url().split('/').pop()))
  await page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=story&globals=viewport:${mode}`)
  await page.waitForSelector('#box')
  const text = await page.locator('#box').textContent()
  const ok = snapshots.length === 1 && snapshots[0].endsWith(`.${mode}.snapshot.json`)
  failed ||= !ok
  console.log(`${ok ? 'PASS' : 'FAIL'}  mode ${mode}`)
  console.log(`      rendered: "${text}"`)
  console.log(`      snapshot file used: ${snapshots.join(', ')}`)
  await page.close()
}
await browser.close()
server.close()
process.exitCode = failed ? 1 : 0
