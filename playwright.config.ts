import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  projects: [
    { name: 'Desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } } },
    { name: 'Mobile', use: { ...devices['Pixel 5'] } },
  ],
})
