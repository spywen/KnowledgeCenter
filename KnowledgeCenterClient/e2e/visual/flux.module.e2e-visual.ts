import { browser, logging } from 'protractor';
import { BaseHelpers } from '../helpers/_baseHelpers';

describe('[VISUAL] Flux', () => {
  let _: BaseHelpers;

  beforeEach(async () => {
    _ = new BaseHelpers();
    await _.navigation.to();
    await _.dev.resetData();
    await _.coreModuleHelper.login('admin');
  });

  it('Publications', async () => {
    await _.navigation.to('flux');

    await _.visualComparison.compareScreens('flux.publications');
  });

  it('Creating new publication', async () => {
    await _.navigation.to('flux');
    await _.button.new();

    await _.visualComparison.compareScreens('flux.creatingPublication');
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
