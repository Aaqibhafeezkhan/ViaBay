import { defineConfig } from '@playwright/test'

export default defineConfig({
    testMatch: ['**/browser.test.ts', '**/browser.test.nopause.ts'],
})
