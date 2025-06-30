import { test, expect } from '@playwright/test';
import TestData from '../data/testData.json';
import { RegisterPage } from '../pages/registerpage';
import { BADFAMILY } from 'dns';



let registerPage: RegisterPage;

test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  await registerPage.visitarPaginaRegistro();
});


test('TC-1 Verificación de elementos visuales en la péagina de registro', async ({ page }) => {
 // await expect(page.getByTestId('input-firstName-registro')).toBeVisible(); no se usa porque es un div y no un input
 await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
  //await page.waitForTimeout(5000);
  // nos permite esperar 5 seg sin hacer nada)
});

test('TC-2 Verificar Boton de registro esta inhabilitado por defecto', async ({ page }) => {
  
  await expect(registerPage.registerButton).toBeDisabled();

})


test('TC-3 Verificar que el boton de registro se habilita al completar los campos', async ({ page }) => {

    await registerPage.completarFormularioRegistro(TestData.usuarioValido);
  //await registerPage.completarFormularioRegistro('Dario', 'Lopez','dari@gmail.com', '123456')
  await expect (registerPage.registerButton).toBeEnabled();
});



test('TC-4 Verificar redireccionamiento a página de inicio de sesión al hacer clic en el botón de registro', async ({ page }) => {
  await registerPage.loginButton.click();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

test('TC-5 Verificar Registro exitoso con datos válidos', async ({ page }) => {
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + TestData.usuarioValido.email.split('@')[1];
  TestData.usuarioValido.email = email;
  await registerPage.completarYHacerClickBotonRegistro(TestData.usuarioValido);
  //await registerPage.completarYHacerClickBotonRegistro('Dario', 'Lopez','dari' +Date.now().toString()+'@gmail.com', '123456');
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});


test('TC-6 Verificar que un usuario no pueda registrarse con un correo electrónico ya existente', async ({ page }) => {
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + TestData.usuarioValido.email.split('@')[1];
  // forma sin el json de data test const email = 'juantorres' + Date.now().toString() + '@email.com';
  TestData.usuarioValido.email = email;
  await registerPage.completarFormularioRegistro(TestData.usuarioValido);
  await registerPage.hacerClickBotonRegistro();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await page.goto('http://localhost:3000/');
  await registerPage.completarFormularioRegistro(TestData.usuarioValido);
  await registerPage.hacerClickBotonRegistro();
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});

/*test('TC-7 Verificar inicio de sesión exitoso con credenciales válidas', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});*/       