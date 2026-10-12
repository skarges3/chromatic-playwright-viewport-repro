// Serves the built archive Storybook and prints a URL per mode, for looking at it by hand.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
const root = path.resolve(process.argv[2] || 'sb')
const id = 'viewport-js-sized-element--snapshot-1'
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
})
server.listen(0, () => {
  const base = `http://localhost:${server.address().port}/iframe.html?id=${id}&viewMode=story`
  console.log('Open each URL in a browser window sized to match the mode:\n')
  console.log(`desktop mode (window 1280px wide): ${base}&globals=viewport:w1280h720`)
  console.log(`mobile mode  (window  393px wide): ${base}&globals=viewport:w393h727`)
  console.log("\nThe page prints the window width it was captured at (about 1280 for the desktop snapshot, about 400 for the mobile one).")
})
