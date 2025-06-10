import { test, expect } from '@playwright/test';

test('TC-1 Verificación de elementos visuales en la péagina de registro', async ({ page }) => {
  await page.goto('https://atena-redux.ngrok.app/signup');
  await expect(page.locator('input[name=firstName]')).toBeVisible();
 // await expect(page.getByTestId('input-firstName-registro')).toBeVisible(); no se usa porque es un div y no un input
  await expect(page.locator('input[name=lastName]')).toBeVisible();
  await expect(page.locator('input[name=email]')).toBeVisible();
  await expect(page.locator('input[name=password]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
  //await page.waitForTimeout(5000);
  // nos permite esperar 5 seg sin hacer nada)
});

test('TC-2 Verificar Boton de registro esta inhabilitado por defecto', async ({ page }) => {
  
  await page.goto('https://atena-redux.ngrok.app/signup');
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();

})


test('TC-3 Verificar que el boton de registro se habilita al completar los campos', async ({ page }) => {
  await page.goto('https://atena-redux.ngrok.app/signup');
  await page.locator('input[name="firstName"]').fill('Dario')
  await page.locator('input[name="lastName"]').fill('Lopez');
  await page.locator('input[name="email"]').fill('dari@email.com');
  await page.locator('input[name="password"]').fill('123456');
  await expect(page.getByTestId('boton-registrarse')).toBeEnabled();
});



test('TC-4 Verificar redireccionamiento a página de inicio de sesión al hacer clic en el botón de registro', async ({ page }) => {
  await page.goto('https://atena-redux.ngrok.app/signup');
  await page.getByTestId('boton-login-header-signup').click();
  await expect(page).toHaveURL('https://atena-redux.ngrok.app/login');
});

test('TC-5 Verificar Registro exitoso con datos válidos', async ({ page }) => {
  await page.goto('https://atena-redux.ngrok.app/signup');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Torres');
  await page.locator('input[name="email"]').fill('juantorres'+Date.now().toString()+'@gmail.com');
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});


test('TC-6 Verificar que un usuario no pueda registrarse con un correo electrónico ya existente', async ({ page }) => {
  const email = 'juantorres' + Date.now().toString() + '@email.com';
  await page.goto('https://atena-redux.ngrok.app/signup');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Torres');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await page.goto('https://atena-redux.ngrok.app/signup');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Torres');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});