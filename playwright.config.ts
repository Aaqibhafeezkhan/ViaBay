import { defineConfig } from '@playwright/test'

export default defineConfig({
    testMatch: [
        '**/*.@(spec|test).?(c|m)[jt]s?(x)',
        '**/browser.test.nopause.ts',
    ],
})
