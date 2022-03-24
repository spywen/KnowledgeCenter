import { browser, logging } from 'protractor';
import { BaseHelpers } from './../helpers/_baseHelpers';

describe('[VISUAL] Administration', () => {
  let _: BaseHelpers;

  beforeEach(async () => {
    _ = new BaseHelpers();
    await _.navigation.to();
    await _.dev.resetData();
    await _.coreModuleHelper.login('admin');
  });

  it('agencies', async () => {
    await _.navigation.to('administration/agencies');

    await _.visualComparison.compareScreens('administration.agencies');
  });

  it('service lines', async () => {
    await _.navigation.to('administration/service-lines');

    await _.visualComparison.compareScreens('administration.service-lines');
  });

  afterEach(async () => {
    await _.coreModuleHelper.logout();

    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
