// Copies the archive Playwright produced (fixture/) into test-results/ so the build step can
// run without re-running the Playwright capture.
import { cpSync, rmSync, mkdirSync } from 'node:fs'
rmSync('test-results/chromatic-archives', { recursive: true, force: true })
mkdirSync('test-results', { recursive: true })
cpSync('fixture/chromatic-archives', 'test-results/chromatic-archives', { recursive: true })
console.log('Copied fixture/chromatic-archives -> test-results/chromatic-archives')
