import { expect, test } from '@playwright/test'

declare global {
    interface Window {
        showModal: (title: string, content: string) => void
    }
}

const base = 'http://localhost:4321'
const viewports = [
    { name: 'desktop', width: 1280, height: 800 },
    { name: 'mobile', width: 390, height: 844 },
]
const zoomLevels = [0.8, 1, 1.25]

test('modal stays open for clicks inside and closes on backdrop after scroll and CSS zoom', async ({ page }) => {
    await page.route(/https:\/\/(unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)\//, route => route.abort())

    for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto(`${base}/tracker`, { waitUntil: 'domcontentloaded' })
        await page.waitForFunction(() => typeof window.showModal === 'function')

        for (const zoom of zoomLevels) {
            await page.evaluate(({ zoom }) => {
                document.documentElement.style.zoom = String(zoom)
                document.documentElement.style.minHeight = '2400px'
                window.scrollTo(0, 600)
            }, { zoom })
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

            await page.evaluate(() => {
                window.showModal('Test modal', 'Clicking this message must not close the modal.')
            })

            const dialog = page.locator('dialog.modal')
            await expect(dialog).toBeVisible()
            await page.locator('dialog.modal .message').click()
            await expect(dialog).toBeVisible()
            await expect(dialog).toHaveAttribute('open', '')

            await page.mouse.click(1, 1)
            await expect(dialog).not.toBeVisible()
            await expect(dialog).not.toHaveAttribute('open')

            await page.evaluate(() => {
                document.documentElement.style.zoom = ''
                document.documentElement.style.minHeight = ''
                window.scrollTo(0, 0)
            })
        }
    }
})

test('modal click handling survives a mobile pinch zoom', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium')

    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${base}/tracker`, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => typeof window.showModal === 'function')
    await page.evaluate(() => {
        document.documentElement.style.minHeight = '2400px'
        window.scrollTo(0, 600)
    })
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

    const session = await page.context().newCDPSession(page)
    await session.send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        mobile: true,
    })
    await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 })
    await session.send('Input.synthesizePinchGesture', {
        x: 195,
        y: 422,
        scaleFactor: 1.5,
        relativeSpeed: 800,
        gestureSourceType: 'touch',
    })
    await expect.poll(() => page.evaluate(() => window.visualViewport?.scale ?? 1)).toBeGreaterThan(1)

    await page.evaluate(() => {
        window.showModal('Test modal', 'Pinch zoom must not make an inside click dismiss this modal.')
    })

    const dialog = page.locator('dialog.modal')
    await expect(dialog).toBeVisible()
    await page.locator('dialog.modal .message').click()
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('open', '')

    await page.mouse.click(1, 1)
    await expect(dialog).not.toBeVisible()
    await expect(dialog).not.toHaveAttribute('open')
    await session.detach()
})
