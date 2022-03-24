import { browser, logging } from 'protractor';
import { BaseHelpers } from '../helpers/_baseHelpers';

describe('[SPEC] Core', () => {
  let _: BaseHelpers;

  beforeEach(async () => {
    _ = new BaseHelpers();
    await _.navigation.to();
    await _.dev.resetData();
  });

  it('login & logout', async () => {
    await _.coreModuleHelper.login('admin');

    await _.dev.hasUserRole('ADMIN');

    await _.coreModuleHelper.logout();
  });

  it('signin', async () => {
    await _.button.click(_.coreModuleHelper.loginSelector);
    await _.button.click(_.coreModuleHelper.signInSelector);
    const signInForm = _.form('.signin');
    await signInForm.writeInsideTextInput(0, 'john');
    await signInForm.writeInsideTextInput(1, 'doe');
    await signInForm.writeInsideTextInput(2, 'jdoe');
    await signInForm.writeInsideTextInput(3, 'jdoe@capgemini.com');
    await signInForm.selectOptionOfAutocompleteInput(_.coreModuleHelper.agencyAutocompleteInputSelector, 'biot', 0); // input
    await signInForm.selectOptionOfSelect(_.coreModuleHelper.serviceLineSelectSelector, 'DTC'); // select
    await signInForm.writeInsideTextInput(5, _.coreModuleHelper.password);
    await signInForm.writeInsideTextInput(6, _.coreModuleHelper.password);
    await signInForm.submit();

    // Activate account (here user is supposed to click on email link to open web site with token)
    const token = await _.dev.getLastActivationToken();
    await _.navigation.to('activate?token=' + token);

    await _.coreModuleHelper.login('jdoe');

    await _.dev.hasUserRole('USER');

    await _.coreModuleHelper.logout();
  });

  it('forgot and recover password', async () => {
    const userEmail = 'admin@capgemini.com';
    const newUserPassword = 'abcd1234!';
    await _.button.click(_.coreModuleHelper.loginSelector);
    await _.button.click(_.coreModuleHelper.forgotSelector);
    const forgotPasswordForm = _.form('.forgotPassword');
    await forgotPasswordForm.writeInsideTextInput(0, userEmail);
    await forgotPasswordForm.submit();

    // Recover password (here user is supposed to click on email link to open web site with token)
    const token = await _.dev.getLastRecoveryPasswordToken();
    await _.navigation.to('passwordrecovery?token=' + token);
    const recoverPasswordForm = _.form('.recoverPassword');
    await recoverPasswordForm.writeInsideTextInput(0, newUserPassword);
    await recoverPasswordForm.writeInsideTextInput(1, newUserPassword);
    await recoverPasswordForm.submit();

    await _.coreModuleHelper.loginWithPassword(userEmail, newUserPassword);

    await _.dev.hasUserRole('USER');

    await _.coreModuleHelper.logout();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
