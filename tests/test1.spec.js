import { test, expect } from '@playwright/test';
const { snapshot } = require('node:test');

let context;
let page;
test.beforeAll(async ({browser}) => {
    context = await browser.newContext();
    await context.tracing.start({snapshots: true, screenshots: true}); 
    page = await context.newPage();
})

test('SignIn', async ({ }) => {

    await page.goto('https://dev.admin.adeptdata.net/');

    await page.locator('#form_item_email').fill('content_manager@gmail.com');
    await page.locator('#form_item_password').fill('Qwerty!2');
    await page.getByRole('button', { name: 'Войти' }).click();

    await page.screenshot({ path: 'after-login-click.png', fullPage: true });
    await expect(page).toHaveURL(/knowledge/);

    await page.goto('https://dev.admin.adeptdata.net/knowledge/new', { waitUntil: 'networkidle' });
    await page.locator('#form_item_name').fill('example database 123');

    await page.locator('#form_item_division_list').click();
    await page.locator('.ant-select-item-option-content', { hasText: 'test' }).click();

    await Promise.all([
        page.waitForResponse(resp =>
          resp.url().includes('/knowledge') && resp.status() === 200
        ),
        page.getByRole('button', { name: 'Сохранить' }).click(),
      ]);

});

test.afterAll(async () =>{
    await context.tracing.stop({path:'test-trace1.zip'})

})