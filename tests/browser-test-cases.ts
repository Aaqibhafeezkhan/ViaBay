import { expect, test } from '@playwright/test'

const base = 'http://localhost:4321'

export function registerBrowserTests() {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            Object.defineProperty(globalThis.navigator, 'geolocation', {
                configurable: true,
                value: {
                    getCurrentPosition: (
                        _success: PositionCallback,
                        error: (reason: { code: number, message: string }) => void,
                    ) => error({ code: 1, message: 'Permission denied' }),
                },
            })
        })

        await page.route('**/api/511**', async route => {
            const url = new URL(route.request().url())
            const moduleName = url.searchParams.get('module')

            if (moduleName === 'gtfsoperators') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([{ Id: 'SF', Name: 'SF Muni' }]),
                })
                return
            }

            if (moduleName === 'VehicleMonitoring') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        Siri: {
                            ServiceDelivery: {
                                VehicleMonitoringDelivery: {
                                    VehicleActivity: [{
                                        MonitoredVehicleJourney: {
                                            VehicleRef: 'test-vehicle-1',
                                            LineRef: 'E',
                                            PublishedLineName: 'E',
                                            OperatorRef: 'SF',
                                            VehicleLocation: {
                                                Latitude: 37.7749,
                                                Longitude: -122.4194,
                                            },
                                        },
                                    }],
                                },
                            },
                        },
                    }),
                })
                return
            }

            await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
        })

        await page.route('https://tile.openstreetmap.org/**', route => route.abort())
    })

    test('tracker renders a map and vehicle markers from mocked 511 data', async ({ page }) => {
        await page.goto(`${base}/tracker`)

        await expect(page.locator('#my-map.leaflet-container')).toBeVisible()
        await expect(page.locator('#my-map .vehicle-marker').filter({ hasText: 'E' })).toBeVisible()
        await expect(page.locator('.vehicle-status')).toHaveText('Showing 1 live vehicles')
    })

    for (const path of ['/', '/book', '/directions', '/settings']) {
        test(`${path} redirects to the tracker`, async ({ page }) => {
            await page.goto(`${base}${path}`)
            await expect(page).toHaveURL(`${base}/tracker`)
            await expect(page.locator('#my-map.leaflet-container')).toBeVisible()
        })
    }
}
