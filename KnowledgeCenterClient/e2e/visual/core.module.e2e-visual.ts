import { browser, logging } from 'protractor';
import { BaseHelpers } from './../helpers/_baseHelpers';

describe('[VISUAL] Core', () => {
  let _: BaseHelpers;

  beforeEach(async () => {
    _ = new BaseHelpers();
    await _.navigation.to();
    await _.dev.resetData();
  });

  it('home', async () => {
    await _.visualComparison.compareScreens('core.home');
  });

  it('home as connected user', async () => {
    await _.coreModuleHelper.login('admin');

    await _.visualComparison.compareScreens('core.home_as_connected_user');

    await _.coreModuleHelper.logout();
  });

  it('menu as connected admin', async () => {
    await _.coreModuleHelper.login('admin');
    await _.coreModuleHelper.openSideMenu();

    await _.visualComparison.compareScreens('core.menu_as_connected_admin');

    await _.coreModuleHelper.logout();
  });

  it('login', async () => {
    await _.navigation.to('login');

    await _.visualComparison.compareScreens('core.login');
  });

  it('forgot password', async () => {
    await _.navigation.to('forgot');

    await _.visualComparison.compareScreens('core.forgot');
  });

  it('recover password', async () => {
    await _.navigation.to('passwordrecovery');

    await _.visualComparison.compareScreens('core.passwordrecovery');
  });

  it('signin', async () => {
    await _.navigation.to('signin');

    await _.visualComparison.compareScreens('core.signin');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
